
let servers = [];

let activeServerId=0;
let serverCFG=[];

let tickCount=0;

(function(){
	//console.log("Tick")
	if(servers[activeServerId]!=undefined){
		servers[activeServerId].getServerConsoleLog();
		if(tickCount%10==0){
			servers[activeServerId].getStats();
		}
	}

	tickCount++;
    setTimeout(arguments.callee, 1000);
})();

const StartStopBtn = document.getElementById('StartStopBtn');
StartStopBtn.disabled=true;
StartStopBtn.addEventListener('click', function(e) {
    console.log('button was clicked');
    StartStopBtn.disabled=true;
    console.log(servers[activeServerId].isStoped());
    console.log(servers[activeServerId].isRunning());
    if(servers[activeServerId].isStoped()){
        servers[activeServerId].Start()    
    }else if(servers[activeServerId].isRunning()){
        servers[activeServerId].Stop()  
    }
});

const updateButton = document.getElementById('updateBtn');
updateButton.disabled=true;
updateButton.addEventListener('click', function(e) {
    if(!servers[activeServerId].isStoped()){
        console.log("Error server is not Stopt")
        return;
    }
    servers[activeServerId].Update()
});
$('#settingsBtn').click(()=>{
	$('.content-main').hide()
	$('.content-settings').show()
});

$('#setting-backBtn').click(()=>{
	$('.content-main').show()
	$('.content-settings').hide()
});
$('#settings-saveBtn').click(()=>{
	saveSrvConfig()
});
$('#settings-killServer').click(()=>{
	if (confirm('Are you sure you want to kill this server ?')) {
		servers[activeServerId].Kill()  
	}
});




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
	updateSettingsDisplay()
}

function updateSettingsDisplay(){
	let s=serverCFG[activeServerId];
	if(s==undefined) return;
	$('#setting-name').val(s.name)
	$('#setting-maxPlayer').val(s.maxPlayers)
	$('#setting-ip').val(s.ip)
	$('#setting-appId').val(s.appId)
	$('#setting-dir').val(s.dir)
	$('#setting-exe').val(s.exec)
	$('#setting-rcon').val(s.rcon)
	$('#setting-password').val(s.password)
	$('#setting-mapStr').val(s.mapStr)
	$('#setting-game').val(s.game)
	$('#setting-port').val(s.port)
	$('#setting-queryport').val(s.port+2)
	$('#setting-beaconport').val(s.port+4)
	$('#setting-rconport').val(s.port+6)
	console.log("set game Stats ",s.GameStats)
	$('#setting-gamestats').prop('checked', s.GameStats);
	if(s.GSLTToken!=null){
		$('#setting-GSLTToken').val(s.GSLTToken)
	}
	else{
		$('#setting-GSLTToken').val("")
	}
	$('#setting-cheats').prop('checked', s.cheats);
}
function saveSrvConfig() {
	console.log("Save CFG")
	let s=serverCFG[activeServerId];
	if(s==undefined) return;
	let newcfg={}
	let n=$('#setting-name').val()
	//$('#setting-ip').val(s.ip)
	//$('#setting-appId').val(s.appId)
	//$('#setting-dir').val(s.dir)
	//$('#setting-exe').val(s.exec)
	let r=$('#setting-rcon').val()
	let p=$('#setting-password').val()
	if(p.length<1){
		p=null;
	}
	let doPost=false;
	if(p!=s.password){
		newcfg.password=p
		doPost=true;
	}
	if(r!=s.rcon){
		newcfg.rcon=r
		doPost=true;
	}
	if(n!=s.name){
		newcfg.name=n
		doPost=true;
	}

	let game=$('#setting-game').val()
	if(game!=s.game){
		if(game.length<1){
			newcfg.game=null;
		}else{
			newcfg.game=game
		}
		doPost=true;
	}
	let mStr=$('#setting-mapStr').val()

	if(mStr!=s.mapStr){
		newcfg.mapStr=mStr;
		doPost=true;
	}

	let maxPlayer=+($('#setting-maxPlayer').val())

	if(maxPlayer!==s.maxPlayers){
		newcfg.maxPlayers=maxPlayer;
		doPost=true;
	}
	

	let GameStats=($('#setting-gamestats').is(':checked'))

	if(GameStats!==s.GameStats){
		newcfg.GameStats=GameStats;
		doPost=true;
	}

	let GSLTToken=($('#setting-GSLTToken').val())

	if(GSLTToken!==s.GSLTToken){
		if(GSLTToken!=null && GSLTToken.length<5){
			GSLTToken=null
		}
		newcfg.GSLTToken=GSLTToken;
		doPost=true;
	}

	let cheats=($('#setting-cheats').is(':checked'))

	if(cheats!==s.cheats){
		newcfg.cheats=cheats;
		doPost=true;
	}

	if(!doPost){
		return console.log("nothing changed return");
	}
	newcfg.sid= activeServerId

	$.post("/updateCfg",newcfg, function( data ) {
        console.log("asw jQuery: "+data)
        if( typeof data=='string' && data.startsWith("error: auth")){
            window.location ="/";
            return;
		} 
		getAllServerData() 
    })
    .fail(function(e) {
        console.log( "error" );
        console.log(e)
    });

}

function updateStats(stats){

	$('#mapName').text(stats.map)
	$('#gameMode').text(stats.raw.rules.GameMode_s)
	let list=$('#playerListTableBody')
	list.empty();
	let id=1;
	stats.players.forEach(p=>{
		list.append(`<tr><td>${id++}</td><td>${p.name}</td><td>${p.score}</td><td>${formatPlayTime(p.time)}</td></tr>`)
	})
}


$('#btn-srvCfg').click(()=>{
	$('.server-main').show()
	$('.server-iniFile').hide()
})
let altiveIni=null;

function getIniFromServer(){
	$.post("/getIniFile",{
		sid:activeServerId,
		ini:altiveIni
	}, function( data ) {
        console.log("asw jQuery: "+data)
        if( typeof data=='string' && data.startsWith("error: auth")){
            window.location ="/";
            return;
		} 
		$('#iniFile-data').val(data)
    })
}

$('#btn-srvIni').click(()=>{
	$('.server-main').hide()
	$('.server-iniFile').show()
	altiveIni='game.ini'
	getIniFromServer()
})
//############################
$('#btn-engineIni').click(()=>{
	$('.server-main').hide()
	$('.server-iniFile').show()
	altiveIni='engine.ini'
	getIniFromServer()
})
//############################
$('#btn-Adminstxt').click(()=>{
	$('.server-main').hide()
	$('.server-iniFile').show()
	altiveIni='Admins.txt'
	getIniFromServer()
})
//############################
$('#btn-MapCycletxt').click(()=>{
	$('.server-main').hide()
	$('.server-iniFile').show()
	altiveIni='MapCycle.txt'
	getIniFromServer()
})

//############################
$('#settings-ini-saveBtn').click(()=>{
	$('#settings-ini-saveBtn')[0].disabled=true
	$.post("/setIniFile",{
		sid:activeServerId,
		ini:altiveIni,
		data:$('#iniFile-data').val()
	}, function( data ) {
        console.log("asw jQuery: "+data)
        if( typeof data=='string' && data.startsWith("error: auth")){
            window.location ="/";
            return;
		} 
	})
	setTimeout(()=>{
		$('#settings-ini-saveBtn')[0].disabled=false
	},5000)
})
