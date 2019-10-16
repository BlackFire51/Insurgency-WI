function load_ServerStatus(){
	$.get("./pages/serverStatus.html", ( data ) =>{
		$('.content-main').html(data)

		initDashbord() 
	})
	.fail((e) => {
		console.log( "error" );
		console.log(e)
	});
}

function load_ServerSettings(){
	$.get("./pages/serverSettings.html", ( data ) =>{
		$('.content-main').html(data)
		initSettings()
	})
	.fail((e) => {
		console.log( "error" );
		console.log(e)
	});
}