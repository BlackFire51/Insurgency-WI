
let servers = [];

let activeServerId=0;
let serverCFG=[];

let tickCount=0;

function initDashbord(){
	setTimeout(()=>{
		//console.log("Tick")
		if(servers[activeServerId]!=undefined){
			servers[activeServerId].getServerConsoleLog();
			if(tickCount%10==0){
				servers[activeServerId].getStats();
			}
		}
		tickCount++;
	},1000);

	$('#StartStopBtn')[0].disabled=true;
	$('#StartStopBtn').click(function(e) {
		console.log('button was clicked');
		$('#StartStopBtn')[0].disabled=true;
		console.log(servers[activeServerId].isStoped());
		console.log(servers[activeServerId].isRunning());
		if(servers[activeServerId].isStoped()){
			servers[activeServerId].Start()    
		}else if(servers[activeServerId].isRunning()){
			servers[activeServerId].Stop()  
		}
	});

	$('#updateBtn')[0].disabled=true;
	$('#updateBtn').click(function(e) {
		if(!servers[activeServerId].isStoped()){
			console.log("Error server is not Stopt")
			return;
		}
		servers[activeServerId].Update()
	});
	$('#settingsBtn').click(()=>{
		load_ServerSettings();
	});


	$('#settings-saveBtn').click(()=>{
		saveSrvConfig()
	});
	$('#settings-killServer').click(()=>{
		if (confirm('Are you sure you want to kill this server ?')) {
			servers[activeServerId].Kill()  
		}
	});

}


function applyStatus(state) {
    let c='gray';
    if(state<statusCssClass.length){
        c=statusCssClass[state];
        $('#status-txt')[0].innerHTML=ServerSateName[state];
    }else{
        $('#status-txt')[0].innerHTML="Unkown"
    }
    // set color for indicator
    $('.status').each((index,element)=>{
        element.className="status "+c;
    });
    // set button status
    if(servers[activeServerId].isStoped()){
        StartStopBtn.disabled=false;
        updateBtn.disabled=false;
    }else if(servers[activeServerId].isRunning()){ 
        StartStopBtn.disabled=false;
        updateBtn.disabled=true;
    }
    else{
        StartStopBtn.disabled=true;
        updateBtn.disabled=true;
    }
}

function formatPlayTime(time){
    time = Math.round(time)
    let sec = time%60
    time=Math.round(time/60)
    let min = time%60
    time=Math.round(time/60)
    let h = time;
    let str=""
    if(h>0){
        str+=h+" H "
    }
    if(min>0){
        str+=min+" m "
    }
    str+=sec+" s"
    return str
}
function getAllServerData(){
	$.post( "/getServerList",{}, function( data ) {
		console.log("asw jQuery: "+data)
		if( typeof data=='string' && data.startsWith("error: auth")){
			window.location ="/";
			return;
		}   
		console.log(data)
		serverCFG=data;
		$('#sideBar-ServerList').empty();
		let i=0;
		data.forEach(e => {
			let nameStr=e.name;
			const serverId=i;
			if(nameStr.length>16){
				nameStr=nameStr.substring(0,16);
			}
			jQuery('<li/>', {
				text:nameStr
			}).appendTo('#sideBar-ServerList').click(()=>{
				console.log("klick ",serverId)
				activeServerId=serverId
				updateSide() 
			})
			let srv= new Server(i);
			srv.cfg=e;
			servers.push(srv);
			i++;
		});
		updateSide() 

	})
	.fail(function(e) {
		console.log( "error" );
		console.log(e)
	});
}
getAllServerData()
function updateSide() {
	let s=serverCFG[activeServerId];
	if(s==undefined) return;

	$('.content-main').show()
	$('.content-settings').hide()
	let nameStr=s.name;
	if(nameStr.length>20){
		nameStr=nameStr.substring(0,20);
	}
	$('.serverName').text(nameStr)
	$('.serverNameLong').text(s.name)
	$('.serverPasswordBool').text(s.password==null?"No":"Yes")
	//updateSettingsDisplay()
}



function updateStats(stats){
	console.log(stats)
	$('#mapName').text(stats.map)
	$('#gameMode').text(stats.raw.rules.GameMode_s)
	let list=$('#playerListTableBody')
	list.empty();
	let id=1;
	stats.players.forEach(p=>{
		list.append(`<tr><td>${id++}</td><td>${p.name}</td><td>${p.score}</td><td>${formatPlayTime(p.time)}</td></tr>`)
	})
}

