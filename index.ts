import express from 'express'
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'
import auth from './auth'
const cfg = require("./cfg.json");


const app = express();
app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())
// serve files from the public directory
app.use(express.static('public'));

// start the express web server listening on 8080
app.listen(cfg.WebPort, () => {
	console.log('listening on ' + cfg.WebPort);
});

// serve the homepage
app.get('/', (req, res) => {
	if (!auth.auth(req, res)) { return; }
	res.sendFile(__dirname + '/public/main.html');

});