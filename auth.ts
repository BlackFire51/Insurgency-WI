import express from 'express'
const cfg = require('./cfg.json')

export default class authC{

	static use(app:express.Application) {
		app.post('/loginAction', (req, res) => {
			console.log('Cookies: ', req.body)
			console.log("loginAction")
			if(req.body.username==undefined || req.body.password==undefined){
				res.send("error: request"); 
				return
			}
				
			let status=login(req.body.username,req.body.password);
			console.log(status)
			if(status.result===false){
				console.log("err")
				res.send("error: data"); 
				return
			}else{
				console.log("ok")
				res=res.cookie("auth" , status.cookie)
				res.send("ok");
			}
		}); 
	}
	static auth(req:express.Request,res:express.Response){
		if(req.cookies.auth==undefined){
			if(res!=undefined){
				res.sendFile(__dirname + '/public/login.html');
			}
			return false;
		}
		if(checkAuthCookie(req.cookies.auth)){
			return true;
		}else{
			if(res!=undefined){
				res.sendFile(__dirname + '/public/login.html');
			}
			return false;
		}
	
	}
}

let valiedAuthCookies =[""];
function checkAuthCookie(cookie:string){
    if(valiedAuthCookies.indexOf(cookie)>-1){
        return true;
    }else{
        return false;
    }
}

function login(name:string,pass:string):{result:boolean,cookie:string}{
    console.log("login()")
    if(cfg.loginCredentials== undefined) return {result:false,cookie:""};
    
    for (let i = 0; i < cfg.loginCredentials.length; i++) {
        let element=cfg.loginCredentials[i];
        if(element.username===name && element.password===pass){

            let s = getRandomString();
            valiedAuthCookies.push(s);
            console.log("cookie: "+s);
            return {result:true,cookie:s};
        }
    }
    return {result:false,cookie:""}
}

function getRandomString(){
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}


