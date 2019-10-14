import * as child from 'child_process';
import {ServerStatus,ServerStatusInternal} from './enums';
import SteamCmd from './SteamCmd'
import ConsoleLog from './ConsoleLog'

class InsurgencyServer{
	private lastUpdate:number;
	private lastData:object;
	private online:boolean;
	private process:any;
	private processStatus:ServerStatus;
	private processInternalStatus:ServerStatusInternal;
	private IState:number;
	private log:ConsoleLog;
	private IntervalTimer:NodeJS.Timeout;
	private playerCount:number;
	private lastRestartTime:Date;
	private restartFrequncy:number;
	private serverId:number;
	//###############
	private cfgData:serverCfgData


	constructor(id:number,srvCfg:any){
		this.updateCfg(srvCfg)
		this.lastUpdate=0
		this.lastData=undefined;
		this.online=false;
		this.process=undefined;
		this.processStatus=ServerStatus.Stoped
		this.processInternalStatus=ServerStatusInternal.None
		this.IState=0
		this.log= new ConsoleLog()
		this.IntervalTimer=setInterval(() => {
			this.tick()
		},600000) //10*60*1000 // 10min
		this.playerCount=-1
		this.lastRestartTime=new Date(0);
		this.restartFrequncy=6
		this.serverId=id
	}
	updateCfg(srvCfg:serverCfgData){
		this.cfgData=srvCfg
	}

	getArgs() {
		let port = this.cfgData.port;
		let args=[]
		let mainStartParam= this.cfgData.mapStr+"?port="+port+"?queryport="+(port+2)+"?beaconport="+(port+4)+"?MaxPlayers="+this.cfgData.maxPlayers;
		if(this.cfgData.password!=null){
			mainStartParam+="?Password="+this.cfgData.password
		}
		if(this.cfgData.game!=null){
			mainStartParam+="?game="+this.cfgData.game  //CheckpointHardcore
		} 
		args.push(mainStartParam);
		args.push("-log","-MapCycle=MapCycle")
		args.push("-hostname=\t"+ this.cfgData.name)
		if(this.cfgData.cheats){
			args.push("-EnableCheats")
		}
		args.push( "-Rcon")
		args.push("-RconPassword="+this.cfgData.rcon)
		args.push("-RconListenPort="+(port+6))
		args.push("-AdminList=Admins")
		if(this.cfgData.GSLTToken!=null){
			args.push("-GSLTToken="+this.cfgData.GSLTToken)
		}
		if(this.cfgData.GameStats){
			args.push("-GameStats")
		}
		
		return args;
	}

	//#####################
	//### Controls
	//#####################

	/**
	 * Starts the server as a new process 
	 */
	Start() {
		let c = this.cfgData;
		console.log(this.getArgs())
		this.process = child.spawn(c.exec,this.getArgs(),{cwd :c.dir});
		this.processStatus=ServerStatus.Running;
		this.process.on('exit', code => {
			console.log(`Exit code is: ${code}`);
			if(code>0){
				this.processStatus= ServerStatus.Crashed;
			}else{
				this.processStatus= ServerStatus.Stoped;
			}
			this.process=undefined;
		});
		// this.log.addProcess(this.process);
		this.lastRestartTime=new Date();
	}
	/**
	 * Stops the server if its running
	 */
	Stop(){
		if(this.process!=undefined){
			this.process.kill('SIGINT'); // strg-C
			this.processStatus= ServerStatus.ShutingDown;
		}
	}
	/**
	 * kills the server if its running
	 */
	Kill(){
		if(this.process!=undefined){
			this.process.kill('SIGKILL'); // kill
			this.processStatus= ServerStatus.ShutingDown;
			setTimeout(()=>{
				if(this.processStatus==ServerStatus.ShutingDown){
					this.process.kill('SIGKILL')
				}
			},120000)		
		}
	}
	/**
	 * will trigger a SteamCmd update if the server is NOT running
	 */
	Update(){
		if(this.processStatus == ServerStatus.Stoped  || this.processStatus == ServerStatus.Crashed ){
			this.processStatus= ServerStatus.Updating;
			let steamcmd = new SteamCmd();
			steamcmd.Update(this.cfgData.dir,this.cfgData.appId,this.log,(sucess)=>{
				if(sucess){
					this.processStatus= ServerStatus.Stoped;
				}else{
					this.processStatus= ServerStatus.Crashed;
				}
			})
		}
	}

	//#####################
	//### Controls
	//#####################


	/**
	 * checks if the Server Process is running
	 */
	public isRunning():boolean{
		return this.process!=undefined;
	}
	/**
	 * Returns the status of the server 
	 * @returns {ServerStatus} Status
	 */
	public getStatus():ServerStatus {
		return this.processStatus;
	}
	/**
	 * returns the Directory the server lifes in 
	 * @returns {string} Dir
	 */
	public getDirectory(): string{
		return this.cfgData.dir;
	}

	//#####################
	//### Automation
	//#####################
	/**
	 * Internal funktion executed on a timer
	 * @param {*} self object refrence of the calling object
	 */
	async tick() {
		console.log("tick()")
		if( this.processInternalStatus== ServerStatusInternal.None ){ // there is no action running
			// get player count
			await this.updateData();
			// check time
			let time = new Date();
			let hours = Math.abs((this.lastRestartTime.getTime() - time.getTime()) / 3600000)
			if(hours>=this.restartFrequncy && this.playerCount<1){  // check if last restart longer then 20h ago and we have no players on the server
				this.autoRestart()               
			}else{
				console.log("ply# "+this.playerCount)
				console.log("h# "+hours)
			}        
		}else{
			console.log("Wrong internal State")
		}
	}
	/**
	 * internal funktion for an Server AutoRestart 
	 */
	autoRestart() {
		console.log("autoRestart()")
		this.processInternalStatus=ServerStatusInternal.AutoRestart;
		this.IState =0;
		var fastTick= function(){
			// wait for shutdown 
			if(this.IState==0 &&( this.processStatus== ServerStatus.Running )){ 
				console.log("fastTick(): Stop Server")
				this.Stop()
				this.IState=1
			}
			if(this.IState==1 &&( this.processStatus== ServerStatus.Stoped || this.processStatus== ServerStatus.Crashed )){             
				// start update
				this.IState=2
				console.log("fastTick(): Update Server")
				// steamcmd.Update(this.cfgData.dir,this.cfgData.appId,this.log,(sucess)=>{
				// 	console.log("fastTick(): Update sucess: "+sucess)
				// 	this.Start();
				// 	this.processInternalStatus=Enums.ServerStatusInternal.None;
				// 	this.IState=3
				// })            
			}
			if(this.IState<2){
				setTimeout(fastTick,1000)
			}
		}
		fastTick=fastTick.bind(this)
		setTimeout(fastTick,1000)
	}

	//#####################
	//### Query
	//#####################
	/**
	 * internal data query function 
	 */
	updateData() {	
	// 	Gamedig.query({
	// 		type: 'insurgency',
	// 		host: this.ip,
	// 		port: this.port+2
	// 	}).then((state) => {
	// 		this.lastData=state
	// 		this.playerCount=state.raw.numplayers
	// 		this.lastUpdate=Date.now()
	// 		this.online=true;
	// 	}).catch((error) => {
	// 		this.lastData=undefined;
	// 		this.playerCount=-1
	// 		this.lastUpdate=Date.now()
	// 		this.online=false;
	// });
	}
	/**
	 * returns promise for live status date form the server
	 */
	getLiveData() {	
		// return Gamedig.query({
		// 	type: 'insurgency',
		// 	host: this.ip,
		// 	port: this.port+2
		// });
	}
}
class serverCfgData{
	public name:string
	public rcon:string
	public GSLTToken:string
	public ip :string
	public port : number
	public mapStr:string
	public exec:string
	public dir:string
	public game:string
	public appId:number
	public maxPlayers:number
	public password:string|undefined|null
	public cheats:boolean
	public GameStats:boolean
}