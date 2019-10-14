'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var express = _interopDefault(require('express'));
var cookieParser = _interopDefault(require('cookie-parser'));
var bodyParser = _interopDefault(require('body-parser'));

var cfg = require('./cfg.json');
var authC = /** @class */ (function () {
    function authC() {
    }
    authC.use = function (app) {
        app.post('/loginAction', function (req, res) {
            console.log('Cookies: ', req.body);
            console.log("loginAction");
            if (req.body.username == undefined || req.body.password == undefined) {
                res.send("error: request");
                return;
            }
            var status = login(req.body.username, req.body.password);
            console.log(status);
            if (status.result === false) {
                console.log("err");
                res.send("error: data");
                return;
            }
            else {
                console.log("ok");
                res = res.cookie("auth", status.cookie);
                res.send("ok");
            }
        });
    };
    authC.auth = function (req, res) {
        if (req.cookies.auth == undefined) {
            if (res != undefined) {
                res.sendFile(__dirname + '/public/login.html');
            }
            return false;
        }
        if (checkAuthCookie(req.cookies.auth)) {
            return true;
        }
        else {
            if (res != undefined) {
                res.sendFile(__dirname + '/public/login.html');
            }
            return false;
        }
    };
    return authC;
}());
var valiedAuthCookies = [""];
function checkAuthCookie(cookie) {
    if (valiedAuthCookies.indexOf(cookie) > -1) {
        return true;
    }
    else {
        return false;
    }
}
function login(name, pass) {
    console.log("login()");
    if (cfg.loginCredentials == undefined)
        return { result: false, cookie: "" };
    for (var i = 0; i < cfg.loginCredentials.length; i++) {
        var element = cfg.loginCredentials[i];
        if (element.username === name && element.password === pass) {
            var s = getRandomString();
            valiedAuthCookies.push(s);
            console.log("cookie: " + s);
            return { result: true, cookie: s };
        }
    }
    return { result: false, cookie: "" };
}
function getRandomString() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

var cfg$1 = require("./cfg.json");
var app = express();
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// serve files from the public directory
app.use(express.static('public'));
// start the express web server listening on 8080
app.listen(cfg$1.WebPort, function () {
    console.log('listening on ' + cfg$1.WebPort);
});
// serve the homepage
app.get('/', function (req, res) {
    if (!authC.auth(req, res)) {
        return;
    }
    res.sendFile(__dirname + '/public/main.html');
});
