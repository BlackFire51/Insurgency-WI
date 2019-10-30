
function initSettings(){
	$('#setting-backBtn').click(()=>{
		load_ServerStatus()
	});
	$('#btn-srvCfg').click(()=>{
		$('.server-main').show()
		$('.server-iniFile').hide()
		$('.server-settings-rcon').hide()
		updateSettingsDisplay()
	})
	$('#btn-srvIni').click(()=>{
		showIni()
		altiveIni='game.ini'
		getIniFromServer()
	})
	//############################
	$('#btn-engineIni').click(()=>{
		showIni()
		altiveIni='engine.ini'
		getIniFromServer()
	})
	//############################
	$('#btn-Adminstxt').click(()=>{
		showIni()
		altiveIni='Admins.txt'
		getIniFromServer()
	})
	//############################
	$('#btn-MapCycletxt').click(()=>{
		showIni()
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

	//############################
	$('#btn-RCon').click(()=>{
		$('.server-main').hide()
		$('.server-iniFile').hide()
		if($('.server-settings-rcon').length==1){
			$('.server-settings-rcon').show()
			updateServerSettingsRconData()
		}else{
			$.get("./pages/serverRconSpam.html", ( data ) =>{
				$('.content-settings-inner').append(data)
				iniServerSettingsRcon();
				updateServerSettingsRconData()
			})
			.fail((e) => {
				console.log( "error" );
				console.log(e)
			});

		}

	})
	updateSettingsDisplay()
	
}
function showIni(){
	$('.server-main').hide()
	$('.server-iniFile').show()
	$('.server-settings-rcon').hide()
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

