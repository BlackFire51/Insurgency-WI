import * as child from 'child_process';

export default class ConsoleLog{
	private consoleLogArray:any[];
	private consoleLogArrayMax:number;
	private consoleLogArrayPtr:number;

	constructor(){
		this.consoleLogArray = [];
		this.consoleLogArrayMax=100;
		this.consoleLogArrayPtr=0;
	}

	getLog(){
		let log="";
		let ptr_real= this.consoleLogArrayPtr%this.consoleLogArrayMax;
		for(let i=ptr_real-1;i>=0;i--){
			log=this.consoleLogArray[i]+""+log;
		}
		if(this.consoleLogArrayPtr>=this.consoleLogArrayMax){ // check if we are in the first "round" and have empty slots 
			for(let i=this.consoleLogArrayMax-1;i>ptr_real;i--){
				log=this.consoleLogArray[i]+""+log;
			}
		}
		return {ptr:this.consoleLogArrayPtr, type:"full" , data: log};
	}


	getLogSince(ptr:number){
		if(this.consoleLogArrayPtr-ptr>=this.consoleLogArrayMax ){ // distance is bigger than saved data .. send all 
			return "[NYI]"; //TODO: fix
		}
		let size = this.consoleLogArrayPtr-ptr;
		let ptr_real= this.consoleLogArrayPtr%this.consoleLogArrayMax;
	
		let log="";
		for(let i=ptr_real-1;i>=0 && size>0 ;i--){
			log=this.consoleLogArray[i]+"\n"+log;
			size--;
		}
		for(let i=this.consoleLogArrayMax-1;i>ptr_real && size>0  ;i--){
			log=this.consoleLogArray[i]+"\n"+log;
			size--;
		}
		return {ptr:this.consoleLogArrayPtr, type:"partial" , data: log};
	}

	addProcess(app:child.ChildProcessWithoutNullStreams){
		app.stdout.on('data', data => this.log(data));
		app.stderr.on('data', data => this.log(data));  
	}
	log (data:any){
		this.consoleLogArray[this.consoleLogArrayPtr]=data.toString('utf8');
		this.consoleLogArrayPtr=(this.consoleLogArrayPtr+1)%this.consoleLogArrayMax;
		//console.log(data.toString('hex'));
		//console.log(data.toString('utf8'));      
	}

}