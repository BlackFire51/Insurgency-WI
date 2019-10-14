import child from 'child_process'
import {ServerStatus,ServerStatusInternal} from './enums';
import ConsoleLog from './ConsoleLog';
const cfg = require('./cfg.json')

export default class SteamCmd{
	private cfg:any
	private Directory:string
	private process:any
	private processStatus:any

    constructor(){
		this.cfg=cfg.SteamCmd;
		this.Directory=cfg.SteamCmd.Directory;
		this.process=undefined
		this.processStatus=undefined
	}

	Update(dir:string,appId:number,log:ConsoleLog,CallBack:(status:boolean)=>void) {
		if(this.processStatus!= ServerStatus.Stoped && this.processStatus==ServerStatus.Crashed){return;}
		let scmd = cfg.SteamCmd; // ./steamcmd.sh
		// ["+login anonymous", "+force_install_dir \"/srv/sandstorm2\"", "+app_update 581330", "+quit"]
		// ["+login anonymous", "+force_install_dir \""+dir+"\"", "+app_update "+appId, "+quit"]
		let args = ["+login anonymous", "+force_install_dir \""+dir+"\"", "+app_update "+appId, "+quit"]; 
		this.process = child.spawn(scmd.exec,args,{cwd :scmd.Directory});
		this.processStatus=ServerStatus.Updating;
		this.process.on('exit', code => {
			console.log(`SteamExit code is: ${code}`);
			if(code>0){
				this.processStatus= ServerStatus.Crashed;
			}else{
				this.processStatus= ServerStatus.Stoped;
			}
			this.process=undefined;
			if(CallBack!=undefined){
				CallBack(code==0)
			}
		});
		if(log!=undefined){
			log.addProcess(this.process)
		}
	}
}



SteamCmd.prototype.getAppInfo = function(appId,callBack) {
    if(this.processStatus!= Enums.ServerStatus.Stoped && this.processStatus==Enums.ServerStatus.Crashed){return;}
    let scmd = cfg.SteamCmd; // "./steamcmd.sh"
    // ["+login anonymous","+app_info_update 1","+app_info_print 581330", "+quit"]
    // ["+login anonymous","+app_info_update 1","+app_info_print "+appId, "+quit"]
    let args = ["+login anonymous","+app_info_update 1","+app_info_print "+appId, "+quit"]; 
    this.process = spawn(scmd.exec,args,{cwd :scmd.Directory});
    this.processStatus=Enums.ServerStatus.Updating;
    var str="";
    this.process.stdout.on('data', function(data) {
        str+=data.toString('utf8');    
    });
    this.process.on('exit', code => {
        let bac=undefined
        console.log(`Exit code is: ${code}`);
        if(code>0){
            this.processStatus= Enums.ServerStatus.Crashed;
        }else{
            bac= getBuildandChangeDate(str)
            console.log(bac)
            this.processStatus= Enums.ServerStatus.Stoped;
        }
        this.process=undefined;
        callBack(bac);
    });
    //addStreamToLog(this.process);
}

function getBuildandChangeDate(str){
    let mRegex= /^AppID : \d*, change number : (\d*)\/\d*, last change : (.*$)/gm
    //var matches_array = test.match(mRegex);
    var matches_array = mRegex.exec(str);
    if(matches_array.length!=3){
        return undefined
    }
    return {buildID:matches_array[1],lastChange:matches_array[2]}
}
var instance = new SteamCmd()
module.exports = instance