function Server(id){
    this.id=id;
    this.CmdLog = new processLogProcessor()
    this.ServerSate=-1;
}
Server.prototype.Start = function(){
    console.log("Server.Start()")
    if(this.isStoped()){
        console.log("Server.Start(): Post")
        this.post("/start",(data)=>{
            console.log("Server.Start() Post Done")
            if(data.ok) {
                console.log('Click was recorded'+ response.body);
                getStatus();
                return;
            }else{
				console.log("error ",data)
			}
        });
    }
}
Server.prototype.Stop = function(){
    console.log("Server.Stop()")
    if(this.isRunning()){
        this.post("/stop",(data)=>{
            if(data.ok) {
                console.log('Click was recorded'+ response.body);
                getStatus();
                return;
            }
        });
    }
}
Server.prototype.Kill = function(){
    console.log("Server.Kill()")
	this.post("/kill",(data)=>{
		if(data.ok) {
			console.log('Click was recorded'+ response.body);
			getStatus();
			return;
		}
	});
    
}
Server.prototype.Update = function(){
    console.log("Server.Update()")
    if(this.isStoped()){
        this.post("/update",(data)=>{
            if(data.ok) {
                console.log('Click was recorded'+ response.body);
                getStatus();
                return;
            }
        });
    }
}


const statusCssClass = ["status-offline","status-online","status-offline","status-updating","status-updating"]

const ServerSateEnum = Object.freeze({"Stoped":0, "Running":1, "Crashed":2, "ShutingDown":3, "Updating":4});
const ServerSateName = Object.freeze(["Stoped", "Running", "Crashed", "ShutingDown", "Updating"]);

Server.prototype.getState= function () {
    return this.ServerSate;
}
Server.prototype.isStoped= function () {
    return this.ServerSate==ServerSateEnum.Stoped || this.ServerSate == ServerSateEnum.Crashed;
}
Server.prototype.isRunning= function () {
    return this.ServerSate==ServerSateEnum.Running;
}

Server.prototype.getStatus= function () {
    this.post("/status", (data)=>{
        console.log( "status: ",data );
        this.ServerSate=data;
        console.log( "applyStatus" );
        applyStatus(this.ServerSate);
    })
}
Server.prototype.getStats= function () {
    this.post("/serverStats", (data)=>{
		if( typeof data=='string' && data.startsWith("error:"))return;
        updateStats(data);
    })
}

Server.prototype.getServerConsoleLog = function() {
    $.post( "/consoleLog",{ptr:this.CmdLog.logPtr,sid:this.id  }, ( data ) => {
        if( typeof data=='string' && data.startsWith("error: auth")){
            window.location ="/";
            return;
        }   
        //console.log( "getServerConsoleLog(): ");
        //console.log( data );
        this.ServerSate=data.status;
        applyStatus(data.status)
        if(this.CmdLog.logPtr == data.ptr) return; // no new data. Nothing to add
        this.CmdLog.log(data.data,data.ptr)
        //TODO move this block in GUI script 
        var textarea = document.getElementById('console-log-txt');
        let isAutoscroll = Math.abs(textarea.scrollTop- (textarea.scrollHeight-210)) <5;
        textarea.innerHTML=this.CmdLog.ProcessedLog;
        // autoscroll
        if(isAutoscroll){
            textarea.scrollTop = textarea.scrollHeight;
        }
    });
}


//########################
Server.prototype.post= function(action,callBack) {
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