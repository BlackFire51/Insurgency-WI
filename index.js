'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var express = _interopDefault(require('express'));
var cookieParser = _interopDefault(require('cookie-parser'));
var bodyParser = _interopDefault(require('body-parser'));

var cfg = require("./cfg.json");
var app = express();
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// serve files from the public directory
app.use(express.static('public'));
//auth.use(app); 
// start the express web server listening on 8080
app.listen(cfg.WebPort, function () {
    console.log('listening on ' + cfg.WebPort);
});
// serve the homepage
app.get('/', function (req, res) {
    //if (!auth.auth(req, res)) { return; }
    res.sendFile(__dirname + '/public/main.html');
});
