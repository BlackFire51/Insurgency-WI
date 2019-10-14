import fs from 'fs'
import path from 'path'
/**
 * read a config/ini file
 */
export default class reader{
	private dirPath:string

	constructor(dir:string){
		this.dirPath=dir
	}
	getIniFile(iniFileType:string,callBack:(data:any)=>void){
		fs.readFile(this.resolveName(iniFileType), {encoding: 'utf-8'}, function(err,data){
			if (err)  return console.log(err);
			callBack(data)
		});
	}
	setIniFile(iniFileType:string,data:any){
		writeProtcedFile(this.resolveName(iniFileType),data,(err)=>{
			if(err) return console.log("error write ini file ",err)
		});
	}
	resolveName(iniFileType:string){
		switch (iniFileType) {
			case 'game.ini':
				return path.join( this.dirPath ,'Insurgency/Saved/Config/LinuxServer/Game.ini')
				
			case 'engine.ini':
				return path.join( this.dirPath ,'Insurgency/Saved/Config/LinuxServer/Engine.ini')
	
			case 'Admins.txt':
				return path.join( this.dirPath ,'Insurgency/Config/Server/Admins.txt')
	
			case 'MapCycle.txt':
				return path.join( this.dirPath ,'Insurgency/Config/Server/MapCycle.txt')
		}
	}
	
}

function writeProtcedFile(filePath:string,data:any,callBack:(err:any)=>void){
	fs.chmodSync(filePath, 0o777);
	fs.writeFile(filePath,data, {encoding: 'utf-8',flag:'w'},(err)=>{
		fs.chmodSync(filePath, 0o444);
		callBack(err)
	});
}


