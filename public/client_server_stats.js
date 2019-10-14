function getServerStats() {
    $.get( "/serverStats", function( data ) {
        console.log( "serverStats: " );
        if(typeof data=='string' && data.startsWith("error: ")){
            console.log(data)
        }else{
            console.log(data)
            ServerStats=data
            $('#serverDisplayName').text(data.name);
            $('#mapName').text(data.map+" ("+data.raw.rules.GameMode_s+")");
            $('#serverPlayers').text('Players: '+data.raw.numplayers +'/'+data.maxplayers);
            if(data.players.length>0){
                let str="<table border='1'><tr><th>Name</th><th>Score</th><th>Time</th></tr>"
                for (let i = 0; i < data.players.length; i++) {
                    const ply = data.players[i];
                    str+="<tr><td>"+ply.name+"</td><td>"+ply.score+"</td><td>"+formatPlayTime(ply.time)+"</td></tr>" 
                }
                str+="</table>"
                console.log(str)
                $('#playerDetails').html(str);
            }
        }
        
        
    });
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


(function(){
    if(ServerSate==ServerSateEnum.Running){
        getServerStats();
    }
    setTimeout(arguments.callee, 10000);
})();