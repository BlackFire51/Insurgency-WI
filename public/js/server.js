

class Server{
	
	constructor(id){
		this.id=id;
		this.CmdLog = new processLogProcessor()
		this.ServerSate=-1;
	}
	Start(){
		console.log("Server.Start()")
		if(this.isStoped()){
			console.log("Server.Start(): Post")
			this.post("/start",(data)=>{
				console.log("Server.Start() Post Done")
				if(data.ok) {
					console.log('Click was recorded'+ response.body);
					this.getStatus();
					return;
				}else{
					console.log("error ",data)
				}
			});
		}
	}
	Stop(){
		console.log("Server.Stop()")
		if(this.isRunning()){
			this.post("/stop",(data)=>{
				if(data.ok) {
					console.log('Click was recorded'+ response.body);
					this.getStatus();
					return;
				}
			});
		}
	}
	Kill(){
		console.log("Server.Kill()")
		this.post("/kill",(data)=>{
			if(data.ok) {
				console.log('Click was recorded'+ response.body);
				this.getStatus();
				return;
			}
		});
		
	}
	Update(){
		console.log("Server.Update()")
		if(this.isStoped()){
			this.post("/update",(data)=>{
				if(data.ok) {
					console.log('Click was recorded'+ response.body);
					this.getStatus();
					return;
				}
			});
		}
	}
	getState () {
		return this.ServerSate;
	}
	isStoped () {
		return this.ServerSate==ServerSateEnum.Stoped || this.ServerSate == ServerSateEnum.Crashed;
	}
	isRunning() {
		return this.ServerSate==ServerSateEnum.Running;
	}

	getStatus() {
		this.post("/status", (data)=>{
			console.log( "status: ",data );
			this.ServerSate=data;
			console.log( "applyStatus" );
			applyStatus(this.ServerSate);
		})
	}

	getStats() {
		this.post("/serverStats", (data)=>{
			if( typeof data=='string' && data.startsWith("error:"))return;
			updateStats(data);
		})
	}
	
	getServerConsoleLog() {
		$.post( "/consoleLog",{ptr:this.CmdLog.logPtr,sid:this.id  }, ( data ) => {
			if( typeof data=='string' && data.startsWith("error: auth")){
				window.location ="/";
				return;
			}   
			// console.log( "getServerConsoleLog(): ");
			// console.log( data );
			this.ServerSate=data.status;
			applyStatus(data.status)
			if(this.CmdLog.logPtr == data.ptr) return; // no new data. Nothing to add
			this.CmdLog.log(data.data,data.ptr)
			//TODO move this block in GUI script 
			var textarea = document.getElementById('console-log-txt');
			textarea.innerHTML=this.CmdLog.ProcessedLog;
			// autoscroll
			$("#console-log-txt").animate({ scrollTop: $('#console-log-txt').prop("scrollHeight")}, 400)
			
		});
	}

	//########################
	post(action,callBack) {
		console.log("Do Post jQuery: "+action)
		$.post( action,{sid:this.id }, function( data ) {
			console.log("asw jQuery: ",data)
			if( typeof data=='string' && data.startsWith("error: auth")){
				window.location ="/";
				return;
			}   
			callBack( data);
		})
		.fail(function(e) {
			console.log( "error" );
			console.log(e)
		});
	}
}





const statusCssClass = ["status-offline","status-online","status-offline","status-updating","status-updating"]

const ServerSateEnum = Object.freeze({"Stoped":0, "Running":1, "Crashed":2, "ShutingDown":3, "Updating":4});
const ServerSateName = Object.freeze(Object.keys(ServerSateEnum));
