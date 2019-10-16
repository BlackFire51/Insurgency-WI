import express from 'express'
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'
import auth from './auth'
import serverManager from './serverManager'

const cfg = require("./cfg.json");


let serversCFG = require('./servers.json')
let srvMgr = new serverManager(serversCFG);

const app = express();
app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())
// serve files from the public directory
app.use(express.static('public'));

auth.use(app)
srvMgr.use(app) 
// start the express web server listening on 8080
app.listen(cfg.WebPort, () => {
	console.log('listening on ' + cfg.WebPort);
});

// serve the homepage
app.get('/', (req, res) => {
	if (!auth.auth(req, res)) { return; }
	res.sendFile(__dirname + '/public/main.html');

});

app.get('/test', (req, res) => {
  
	if(!auth.auth(req,res)) { return;}
	console.log('Cookies: ', req.cookies.auth)
	console.log('Signed Cookies: ', req.signedCookies)
	res.sendFile(__dirname + '/public/index.html');
  
  });