
function checkValues(){
    if($("#username")[0].value.length <1 ){
        $("#username").effect( "shake" );
        return false;
    }
    if($("#password")[0].value.length <1 ){
        $("#password").effect( "shake" );
        return false;
    }
    return true;
}


function login () {
    console.log("Btn")
    if(checkValues()){
        let user=$("#username").val();
        let pass=$("#password").val();
        $.post( "/loginAction",{username:user,password:pass }, function( data ) {
            console.log( "Login: ");
            console.log( data );
            if(data=="ok"){
                window.location ="/";
            }
        });
    }
}

$("button").on("click", login);

$("#username").on("keyup", function(event) { 
    if (event.keyCode === 13) {
      event.preventDefault();
      login();
    }
});
$("#password").on("keyup", function(event) { 
    if (event.keyCode === 13) {
      event.preventDefault();
      login();
    }
});