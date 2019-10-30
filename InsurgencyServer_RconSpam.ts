import Rcon from 'rcon'

export default class rconSpammer{
	private ip:string
	private port:number
	private rconPassword:string
	private connection:any
	private intervalTime:number
	private intervalObj:NodeJS.Timeout
	private msgPtr:number
	private msgArr:string[]

	constructor(ip:string,port:number,rconPassword:string){
		this.ip=ip
		this.port=port
		this.rconPassword=rconPassword
		this.intervalTime=1000*60*2
		this.msgPtr=0
		this.msgArr=[]
		this.connection=null
	}
	setArray(strArr:string[]){
		this.msgArr=strArr
	}
	setDelay(delay:number){
		if(delay<10)delay=10
		this.intervalTime=1000*delay
	}

	start(){
		console.log("Rcon SPAMer Start A")
		if(this.connection!=null) return;
		console.log("Rcon SPAMer Start B")
		console.log(JSON.stringify(this))
		this.connection= new Rcon(this.ip, this.port, this.rconPassword);
		this.connection.on('auth', ()=> {
			console.log("Authed!");
			this.intervalObj=setInterval(()=>{
				this.spamAdvert()
			}, this.intervalTime);
		
		}).on('response', function(str) {
			// console.log("Got response: " + Buffer.from(str).toString('base64'));
			// console.log("Got response: " + str);
			//conn.disconnect();
		}).on('end', function() {
			console.log("Socket closed!");
			//  process.exit();
			setTimeout(()=>{
				console.log("Reconnect Rcon A!");
				this.connection.connect();
			},120000)
		
		}).on('error', function(e) {
			console.log("err ",e);
			//  process.exit();
			setTimeout(()=>{
				console.log("Reconnect Rcon B!");
				this.connection.connect();
			},300000)
		});
		
		this.connection.connect();
	}

	spamAdvert() {
		//	conn.send("say ----------------");
		this.connection.send("say "+this.msgArr[this.msgPtr%this.msgArr.length]);
		this.msgPtr=(this.msgPtr+1)%this.msgArr.length;
	}

}