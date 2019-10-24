
const MAX_RCON_SPAM_LEN=40
function iniServerSettingsRcon(){

	$('#setting-rcon-msgs').keyup(function (){
		let txt = $(this).val()
		let arr = txt.split('\n');
		arr=arr.map(l=>{
			if(l.length>MAX_RCON_SPAM_LEN){
				return l.substring(0,MAX_RCON_SPAM_LEN)
			}
			return l
		})
		$(this).val(arr.join('\n'))

	})
	$('#settings-rcon-saveBtn').click(()=>{
		$.post("/updateRconSpam",{
			sid:activeServerId,
			data:{
				msgs:$('#setting-rcon-msgs').val(),
				delay:+$('#setting-rcon-delay').val(),
				rep:+$('#setting-rcon-rep').val(),
			}
		}, function( data ) {
			console.log("asw jQuery: "+data)
			if( typeof data=='string' && data.startsWith("error: auth")){
				window.location ="/";
				return;
			} 
		})

	})
}
