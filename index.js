'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var express = _interopDefault(require('express'));
var cookieParser = _interopDefault(require('cookie-parser'));
var bodyParser = _interopDefault(require('body-parser'));
var child = require('child_process');
var child__default = _interopDefault(child);
var fs = _interopDefault(require('fs'));
var path = _interopDefault(require('path'));
var Rcon = _interopDefault(require('rcon'));
var Gamedig = _interopDefault(require('gamedig'));

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

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */

function __awaiter(thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

var ServerStatus;
(function (ServerStatus) {
    ServerStatus[ServerStatus["Stoped"] = 0] = "Stoped";
    ServerStatus[ServerStatus["Running"] = 1] = "Running";
    ServerStatus[ServerStatus["Crashed"] = 2] = "Crashed";
    ServerStatus[ServerStatus["ShutingDown"] = 3] = "ShutingDown";
    ServerStatus[ServerStatus["Updating"] = 4] = "Updating";
})(ServerStatus || (ServerStatus = {}));
var ServerStatusInternal;
(function (ServerStatusInternal) {
    ServerStatusInternal[ServerStatusInternal["None"] = 0] = "None";
    ServerStatusInternal[ServerStatusInternal["AutoRestart"] = 1] = "AutoRestart";
    ServerStatusInternal[ServerStatusInternal["AutoUpdate"] = 2] = "AutoUpdate";
})(ServerStatusInternal || (ServerStatusInternal = {}));

var cfg$1 = require('./cfg.json');
var SteamCmd = /** @class */ (function () {
    function SteamCmd() {
        this.cfg = cfg$1.SteamCmd;
        this.Directory = cfg$1.SteamCmd.Directory;
        this.process = undefined;
        this.processStatus = undefined;
    }
    SteamCmd.prototype.Update = function (dir, appId, log, CallBack) {
        var _this = this;
        if (this.processStatus != ServerStatus.Stoped && this.processStatus == ServerStatus.Crashed) {
            return;
        }
        var scmd = cfg$1.SteamCmd; // ./steamcmd.sh
        // ["+login anonymous", "+force_install_dir \"/srv/sandstorm2\"", "+app_update 581330", "+quit"]
        // ["+login anonymous", "+force_install_dir \""+dir+"\"", "+app_update "+appId, "+quit"]
        var args = ["+login anonymous", "+force_install_dir \"" + dir + "\"", "+app_update " + appId, "+quit"];
        this.process = child__default.spawn(scmd.exec, args, { cwd: scmd.Directory });
        this.processStatus = ServerStatus.Updating;
        this.process.on('exit', function (code) {
            console.log("SteamExit code is: " + code);
            if (code > 0) {
                _this.processStatus = ServerStatus.Crashed;
            }
            else {
                _this.processStatus = ServerStatus.Stoped;
            }
            _this.process = undefined;
            if (CallBack != undefined) {
                CallBack(code == 0);
            }
        });
        if (log != undefined) {
            log.addProcess(this.process);
        }
    };
    SteamCmd.prototype.getAppInfo = function (appId, callBack) {
        var _this = this;
        if (this.processStatus != ServerStatus.Stoped && this.processStatus == ServerStatus.Crashed) {
            return;
        }
        var scmd = cfg$1.SteamCmd; // "./steamcmd.sh"
        // ["+login anonymous","+app_info_update 1","+app_info_print 581330", "+quit"]
        // ["+login anonymous","+app_info_update 1","+app_info_print "+appId, "+quit"]
        var args = ["+login anonymous", "+app_info_update 1", "+app_info_print " + appId, "+quit"];
        this.process = child__default.spawn(scmd.exec, args, { cwd: scmd.Directory });
        this.processStatus = ServerStatus.Updating;
        var str = "";
        this.process.stdout.on('data', function (data) {
            str += data.toString('utf8');
        });
        this.process.on('exit', function (code) {
            var bac = undefined;
            console.log("Exit code is: " + code);
            if (code > 0) {
                _this.processStatus = ServerStatus.Crashed;
            }
            else {
                bac = getBuildandChangeDate(str);
                console.log(bac);
                _this.processStatus = ServerStatus.Stoped;
            }
            _this.process = undefined;
            callBack(bac);
        });
        //addStreamToLog(this.process);
    };
    return SteamCmd;
}());
function getBuildandChangeDate(str) {
    var mRegex = /^AppID : \d*, change number : (\d*)\/\d*, last change : (.*$)/gm;
    //var matches_array = test.match(mRegex);
    var matches_array = mRegex.exec(str);
    if (matches_array.length != 3) {
        return undefined;
    }
    return { buildID: matches_array[1], lastChange: matches_array[2] };
}

var ConsoleLog = /** @class */ (function () {
    function ConsoleLog() {
        this.consoleLogArray = [];
        this.consoleLogArrayMax = 100;
        this.consoleLogArrayPtr = 0;
    }
    ConsoleLog.prototype.getLog = function () {
        var log = "";
        var ptr_real = this.consoleLogArrayPtr % this.consoleLogArrayMax;
        for (var i = ptr_real - 1; i >= 0; i--) {
            log = this.consoleLogArray[i] + "" + log;
        }
        if (this.consoleLogArrayPtr >= this.consoleLogArrayMax) { // check if we are in the first "round" and have empty slots 
            for (var i = this.consoleLogArrayMax - 1; i > ptr_real; i--) {
                log = this.consoleLogArray[i] + "" + log;
            }
        }
        return { ptr: this.consoleLogArrayPtr, type: "full", data: log };
    };
    ConsoleLog.prototype.getLogSince = function (ptr) {
        if (this.consoleLogArrayPtr - ptr >= this.consoleLogArrayMax) { // distance is bigger than saved data .. send all 
            return "[NYI]"; //TODO: fix
        }
        var size = this.consoleLogArrayPtr - ptr;
        var ptr_real = this.consoleLogArrayPtr % this.consoleLogArrayMax;
        var log = "";
        for (var i = ptr_real - 1; i >= 0 && size > 0; i--) {
            log = this.consoleLogArray[i] + "\n" + log;
            size--;
        }
        for (var i = this.consoleLogArrayMax - 1; i > ptr_real && size > 0; i--) {
            log = this.consoleLogArray[i] + "\n" + log;
            size--;
        }
        return { ptr: this.consoleLogArrayPtr, type: "partial", data: log };
    };
    ConsoleLog.prototype.addProcess = function (app) {
        var _this = this;
        app.stdout.on('data', function (data) { return _this.log(data); });
        app.stderr.on('data', function (data) { return _this.log(data); });
    };
    ConsoleLog.prototype.log = function (data) {
        this.consoleLogArray[this.consoleLogArrayPtr] = data.toString('utf8');
        this.consoleLogArrayPtr = (this.consoleLogArrayPtr + 1) % this.consoleLogArrayMax;
        //console.log(data.toString('hex'));
        //console.log(data.toString('utf8'));      
    };
    return ConsoleLog;
}());

/**
 * read a config/ini file
 */
var reader = /** @class */ (function () {
    function reader(dir) {
        this.dirPath = dir;
    }
    reader.prototype.getIniFile = function (iniFileType, callBack) {
        fs.readFile(this.resolveName(iniFileType), { encoding: 'utf-8' }, function (err, data) {
            if (err)
                return console.log(err);
            callBack(data);
        });
    };
    reader.prototype.setIniFile = function (iniFileType, data) {
        writeProtcedFile(this.resolveName(iniFileType), data, function (err) {
            if (err)
                return console.log("error write ini file ", err);
        });
    };
    reader.prototype.resolveName = function (iniFileType) {
        switch (iniFileType) {
            case 'game.ini':
                return path.join(this.dirPath, 'Insurgency/Saved/Config/LinuxServer/Game.ini');
            case 'engine.ini':
                return path.join(this.dirPath, 'Insurgency/Saved/Config/LinuxServer/Engine.ini');
            case 'Admins.txt':
                return path.join(this.dirPath, 'Insurgency/Config/Server/Admins.txt');
            case 'MapCycle.txt':
                return path.join(this.dirPath, 'Insurgency/Config/Server/MapCycle.txt');
        }
    };
    return reader;
}());
function writeProtcedFile(filePath, data, callBack) {
    fs.chmodSync(filePath, 511);
    fs.writeFile(filePath, data, { encoding: 'utf-8', flag: 'w' }, function (err) {
        fs.chmodSync(filePath, 292);
        callBack(err);
    });
}

var rconSpammer = /** @class */ (function () {
    function rconSpammer(ip, port, rconPassword) {
        this.ip = ip;
        this.port = port;
        this.rconPassword = rconPassword;
        this.intervalTime = 1000 * 60 * 2;
        this.msgPtr = 0;
        this.msgArr = [];
        this.connection = null;
    }
    rconSpammer.prototype.setArray = function (strArr) {
        this.msgArr = strArr.filter(function (l) { return l.length > 3; });
    };
    rconSpammer.prototype.setDelay = function (delay) {
        if (delay < 10)
            delay = 10;
        this.intervalTime = 1000 * delay;
    };
    rconSpammer.prototype.start = function () {
        var _this = this;
        console.log("Rcon SPAMer Start A");
        if (this.connection != null)
            return;
        console.log("Rcon SPAMer Start B");
        console.log(JSON.stringify(this));
        this.connection = new Rcon(this.ip, this.port, this.rconPassword);
        this.connection.on('auth', function () {
            console.log("Authed!");
            _this.intervalObj = setInterval(function () {
                _this.spamAdvert();
            }, _this.intervalTime);
        }).on('response', function (str) {
            // console.log("Got response: " + Buffer.from(str).toString('base64'));
            // console.log("Got response: " + str);
            //conn.disconnect();
        }).on('end', function () {
            console.log("Socket closed!");
            //  process.exit();
            clearInterval(_this.intervalObj);
            setTimeout(function () {
                console.log("Reconnect Rcon A!");
                _this.connection.connect();
            }, 120000);
        }).on('error', function (e) {
            console.log("err ", e);
            //  process.exit();
            clearInterval(_this.intervalObj);
            setTimeout(function () {
                console.log("Reconnect Rcon B!");
                _this.connection.connect();
            }, 300000);
        });
        this.connection.connect();
    };
    rconSpammer.prototype.stop = function () {
        console.log("Rcon SPAMer STOP A");
        if (this.connection == null)
            return;
        console.log("Rcon SPAMer STOP B");
        clearInterval(this.intervalObj);
        this.connection.disconnect();
        this.connection = null;
        this.intervalObj = null;
    };
    rconSpammer.prototype.spamAdvert = function () {
        //	conn.send("say ----------------");
        this.connection.send("say " + this.msgArr[this.msgPtr % this.msgArr.length]);
        this.msgPtr = (this.msgPtr + 1) % this.msgArr.length;
    };
    return rconSpammer;
}());

var InsurgencyServer = /** @class */ (function () {
    function InsurgencyServer(id, srvCfg) {
        var _this = this;
        this.updateCfg(srvCfg);
        this.lastUpdate = 0;
        this.lastData = undefined;
        this.online = false;
        this.process = undefined;
        this.processStatus = ServerStatus.Stoped;
        this.processInternalStatus = ServerStatusInternal.None;
        this.IState = 0;
        this.log = new ConsoleLog();
        this.IntervalTimer = setInterval(function () {
            _this.tick();
        }, 600000); //10*60*1000 // 10min
        this.playerCount = -1;
        this.lastRestartTime = new Date(0);
        this.restartFrequncy = 6;
        this.serverId = id;
        this.fileReader = new reader(this.cfgData.dir);
    }
    InsurgencyServer.prototype.updateCfg = function (srvCfg) {
        this.cfgData = srvCfg;
    };
    InsurgencyServer.prototype.getServerCfg = function () {
        return this.cfgData;
    };
    InsurgencyServer.prototype.startRconSpam = function (overrideMsgs, overrideDelay) {
        if (overrideMsgs === void 0) { overrideMsgs = undefined; }
        if (overrideDelay === void 0) { overrideDelay = undefined; }
        console.log("startRconSpam", overrideMsgs, overrideDelay);
        if (overrideMsgs != undefined) {
            if (this.cfgData.rconSpam == undefined)
                this.cfgData.rconSpam = new rconSpamCfgData();
            this.cfgData.rconSpam.msgs = overrideMsgs;
        }
        if (overrideDelay != undefined) {
            if (this.cfgData.rconSpam == undefined)
                this.cfgData.rconSpam = new rconSpamCfgData();
            this.cfgData.rconSpam.delay = overrideDelay;
        }
        if (this.rconSpam == undefined && this.cfgData.rconSpam != undefined && this.cfgData.rconSpam.msgs != undefined && this.cfgData.rconSpam.msgs.length > 0) {
            console.log("create new Spamer");
            this.rconSpam = new rconSpammer('127.0.0.1', this.cfgData.port + 6, this.cfgData.rcon);
            this.rconSpam.setArray(this.cfgData.rconSpam.msgs);
            this.rconSpam.setDelay(this.cfgData.rconSpam.delay);
            this.rconSpam.start();
        }
    };
    InsurgencyServer.prototype.stopRconSpam = function () {
        console.log("stopRconSpam");
        if (this.rconSpam != undefined) {
            this.rconSpam.stop();
            this.rconSpam = undefined;
        }
    };
    InsurgencyServer.prototype.getArgs = function () {
        var port = this.cfgData.port;
        var args = [
            "-Port=" + port,
            "-Queryport=" + (port + 2),
            "-Beaconport=" + (port + 4),
            "-MaxPlayers=" + this.cfgData.maxPlayers
        ];
        var mainStartParam = this.cfgData.mapStr;
        if (this.cfgData.password != null) {
            mainStartParam += "?Password=" + this.cfgData.password;
        }
        if (this.cfgData.game != null) {
            mainStartParam += "?game=" + this.cfgData.game; //CheckpointHardcore
        }
        mainStartParam += "?MaxPlayers=" + this.cfgData.maxPlayers;
        args.push(mainStartParam);
        args.push("-log", "-MapCycle=MapCycle");
        args.push("-hostname=\t" + this.cfgData.name);
        if (this.cfgData.cheats) {
            args.push("-EnableCheats");
        }
        args.push("-Rcon");
        args.push("-RconPassword=" + this.cfgData.rcon);
        args.push("-RconListenPort=" + (port + 6));
        args.push("-AdminList=Admins");
        if (this.cfgData.GSLTToken != null) {
            args.push("-GSLTToken=" + this.cfgData.GSLTToken);
        }
        if (this.cfgData.GameStats) {
            args.push("-GameStats");
        }
        return args;
    };
    //#####################
    //### Controls
    //#####################
    /**
     * Starts the server as a new process
     */
    InsurgencyServer.prototype.Start = function () {
        var _this = this;
        var c = this.cfgData;
        console.log(this.getArgs());
        this.process = child.spawn(c.exec, this.getArgs(), { cwd: c.dir });
        this.processStatus = ServerStatus.Running;
        this.process.on('exit', function (code) {
            console.log("Exit code is: " + code);
            if (code > 0) {
                _this.processStatus = ServerStatus.Crashed;
            }
            else {
                _this.processStatus = ServerStatus.Stoped;
            }
            _this.process = undefined;
        });
        this.log.addProcess(this.process);
        this.lastRestartTime = new Date();
        setTimeout(function () {
            _this.startRconSpam();
        }, 20000);
    };
    /**
     * Stops the server if its running
     */
    InsurgencyServer.prototype.Stop = function () {
        if (this.process != undefined) {
            this.process.kill('SIGINT'); // strg-C
            this.processStatus = ServerStatus.ShutingDown;
        }
    };
    /**
     * kills the server if its running
     */
    InsurgencyServer.prototype.Kill = function () {
        var _this = this;
        if (this.process != undefined) {
            this.process.kill('SIGKILL'); // kill
            this.processStatus = ServerStatus.ShutingDown;
            setTimeout(function () {
                if (_this.processStatus == ServerStatus.ShutingDown) {
                    _this.process.kill('SIGKILL');
                }
            }, 120000);
        }
    };
    /**
     * will trigger a SteamCmd update if the server is NOT running
     */
    InsurgencyServer.prototype.Update = function () {
        var _this = this;
        if (this.processStatus == ServerStatus.Stoped || this.processStatus == ServerStatus.Crashed) {
            this.processStatus = ServerStatus.Updating;
            var steamcmd = new SteamCmd();
            steamcmd.Update(this.cfgData.dir, this.cfgData.appId, this.log, function (sucess) {
                if (sucess) {
                    _this.processStatus = ServerStatus.Stoped;
                }
                else {
                    _this.processStatus = ServerStatus.Crashed;
                }
            });
        }
    };
    //#####################
    //### Controls
    //#####################
    /**
     * checks if the Server Process is running
     */
    InsurgencyServer.prototype.isRunning = function () {
        return this.process != undefined;
    };
    /**
     * Returns the status of the server
     * @returns {ServerStatus} Status
     */
    InsurgencyServer.prototype.getStatus = function () {
        return this.processStatus;
    };
    /**
     * returns the Directory the server lifes in
     * @returns {string} Dir
     */
    InsurgencyServer.prototype.getDirectory = function () {
        return this.cfgData.dir;
    };
    //#####################
    //### Automation
    //#####################
    /**
     * Internal funktion executed on a timer
     * @param {*} self object refrence of the calling object
     */
    InsurgencyServer.prototype.tick = function () {
        return __awaiter(this, void 0, void 0, function () {
            var time, hours;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("tick()");
                        if (!(this.processInternalStatus == ServerStatusInternal.None)) return [3 /*break*/, 2];
                        // get player count
                        return [4 /*yield*/, this.updateData()];
                    case 1:
                        // get player count
                        _a.sent();
                        time = new Date();
                        hours = Math.abs((this.lastRestartTime.getTime() - time.getTime()) / 3600000);
                        if (hours >= this.restartFrequncy && this.playerCount < 1) { // check if last restart longer then 20h ago and we have no players on the server
                            this.autoRestart();
                        }
                        else {
                            console.log("ply# " + this.playerCount);
                            console.log("h# " + hours);
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        console.log("Wrong internal State");
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * internal funktion for an Server AutoRestart
     */
    InsurgencyServer.prototype.autoRestart = function () {
        console.log("autoRestart()");
        this.processInternalStatus = ServerStatusInternal.AutoRestart;
        this.IState = 0;
        var fastTick = function () {
            // wait for shutdown 
            if (this.IState == 0 && (this.processStatus == ServerStatus.Running)) {
                console.log("fastTick(): Stop Server");
                this.Stop();
                this.IState = 1;
            }
            if (this.IState == 1 && (this.processStatus == ServerStatus.Stoped || this.processStatus == ServerStatus.Crashed)) {
                // start update
                this.IState = 2;
                console.log("fastTick(): Update Server");
                // steamcmd.Update(this.cfgData.dir,this.cfgData.appId,this.log,(sucess)=>{
                // 	console.log("fastTick(): Update sucess: "+sucess)
                // 	this.Start();
                // 	this.processInternalStatus=Enums.ServerStatusInternal.None;
                // 	this.IState=3
                // })            
            }
            if (this.IState < 2) {
                setTimeout(fastTick, 1000);
            }
        };
        fastTick = fastTick.bind(this);
        setTimeout(fastTick, 1000);
    };
    //#####################
    //### Query
    //#####################
    InsurgencyServer.prototype.getData = function () {
        if ((Date.now() - this.lastUpdate) > 10000) {
            this.updateData();
        }
        return this.lastData;
    };
    /**
     * internal data query function
     */
    InsurgencyServer.prototype.updateData = function () {
        var _this = this;
        Gamedig.query({
            type: 'insurgency',
            host: this.cfgData.ip,
            port: this.cfgData.port + 2
        }).then(function (state) {
            _this.lastData = state;
            _this.playerCount = state.raw.numplayers;
            _this.lastUpdate = Date.now();
            _this.online = true;
        }).catch(function (error) {
            _this.lastData = undefined;
            _this.playerCount = -1;
            _this.lastUpdate = Date.now();
            _this.online = false;
        });
    };
    /**
     * returns promise for live status date form the server
     */
    InsurgencyServer.prototype.getLiveData = function () {
        return Gamedig.query({
            type: 'insurgency',
            host: this.cfgData.ip,
            port: this.cfgData.port + 2
        });
    };
    return InsurgencyServer;
}());
var rconSpamCfgData = /** @class */ (function () {
    function rconSpamCfgData() {
    }
    return rconSpamCfgData;
}());

var srvManager = /** @class */ (function () {
    function srvManager(serversCFG) {
        this.serversCFG = serversCFG;
        this.Servers = [];
        for (var i = 0; i < serversCFG.length; i++) {
            var s = serversCFG[i];
            this.Servers[i] = new InsurgencyServer(i, s);
        }
    }
    srvManager.prototype.use = function (app) {
        var _this = this;
        app.post('/start', function (req, res) {
            console.log("Start");
            console.log(req.body);
            if (!authC.auth(req, res)) {
                res.send("error: auth");
                return;
            }
            if (req.body.sid == undefined || _this.Servers[req.body.sid] == undefined)
                return res.send("err server Not Found");
            var s = _this.Servers[req.body.sid].getStatus();
            if (s != ServerStatus.Stoped && s != ServerStatus.Crashed) {
                res.send("error: status");
                return;
            }
            console.log('body: ', req.body);
            _this.Servers[req.body.sid].Start();
            res.send("ok");
        });
        app.post('/stop', function (req, res) {
            console.log(req.body);
            if (!authC.auth(req, res)) {
                res.send("error: auth");
                return;
            }
            if (req.body.sid == undefined || _this.Servers[req.body.sid] == undefined)
                return res.send("err server Not Found");
            console.log("Stop");
            var s = _this.Servers[req.body.sid].getStatus();
            if (s != ServerStatus.Running) {
                res.send("error: status");
                return;
            }
            console.log('Cookies: ', req.cookies);
            _this.Servers[req.body.sid].Stop();
            res.send("ok");
        });
        app.post('/kill', function (req, res) {
            console.log(req.body);
            if (!authC.auth(req, res)) {
                res.send("error: auth");
                return;
            }
            if (req.body.sid == undefined || _this.Servers[req.body.sid] == undefined)
                return res.send("err server Not Found");
            console.log("kill");
            var s = _this.Servers[req.body.sid].getStatus();
            if (s != ServerStatus.Running) {
                res.send("error: status");
                return;
            }
            console.log('Cookies: ', req.cookies);
            _this.Servers[req.body.sid].Kill();
            res.send("ok");
        });
        app.post('/update', function (req, res) {
            if (!authC.auth(req, res)) {
                res.send("error: auth");
                return;
            }
            if (req.body.sid == undefined || _this.Servers[req.body.sid] == undefined)
                return res.send("err server Not Found");
            console.log("update");
            var s = _this.Servers[req.body.sid].getStatus();
            if (s != ServerStatus.Stoped && s != ServerStatus.Crashed) {
                res.send("error: status");
                return;
            }
            console.log('Cookies: ', req.cookies);
            _this.Servers[req.body.sid].Update();
            res.send("ok");
        });
        app.post('/status', function (req, res) {
            if (!authC.auth(req, res)) {
                res.send("error: auth");
                return;
            }
            console.log("Status");
            if (req.body.sid == undefined || _this.Servers[req.body.sid] == undefined)
                return res.send("err server Not Found");
            var str = _this.Servers[req.body.sid].getStatus().toString();
            console.log(str);
            res.send(str);
        });
        app.post('/serverStats', function (req, res) {
            if (!authC.auth(req, res)) {
                res.send("error: auth");
                return;
            }
            if (req.body.sid == undefined || _this.Servers[req.body.sid] == undefined)
                return res.send("err server Not Found");
            //console.log("serverStats")
            var data = _this.Servers[req.body.sid].getData();
            if (data == undefined) {
                res.send("error: no data avalable");
            }
            else {
                res.send(data);
            }
        });
        app.post('/consoleLog', function (req, res) {
            if (!authC.auth(req, res)) {
                res.send("error: auth");
                return;
            }
            //console.log("ConsoleLog")
            //console.log(req.body);
            if (req.body.sid == undefined || _this.Servers[req.body.sid] == undefined)
                return res.send("err");
            var log = undefined;
            if (req.body.ptr != undefined) {
                log = _this.Servers[req.body.sid].log.getLogSince(req.body.ptr);
            }
            else {
                log = _this.Servers[req.body.sid].log.getLog();
            }
            log.status = _this.Servers[req.body.sid].getStatus();
            res.send(log);
        });
        //##############################
        app.post('/getServerList', function (req, res) {
            if (!authC.auth(req, res)) {
                res.send("error: auth");
                return;
            }
            res.send(_this.serversCFG);
        });
        app.post('/updateCfg', function (req, res) {
            if (!authC.auth(req, res)) {
                res.send("error: auth");
                return;
            }
            console.log('updateCfg: ', req.body);
            if (_this.serversCFG[req.body.sid] == undefined)
                return;
            if (req.body.name) {
                _this.serversCFG[req.body.sid].name = req.body.name;
            }
            if (req.body.rcon) {
                _this.serversCFG[req.body.sid].rcon = req.body.rcon;
            }
            if (req.body.password != undefined) {
                if (req.body.password.length > 0) {
                    _this.serversCFG[req.body.sid].password = req.body.password;
                }
                else {
                    _this.serversCFG[req.body.sid].password = null;
                }
            }
            if (req.body.game != undefined) {
                if (req.body.game.length > 0) {
                    _this.serversCFG[req.body.sid].game = req.body.game;
                }
                else {
                    _this.serversCFG[req.body.sid].game = null;
                }
            }
            if (req.body.mapStr) {
                _this.serversCFG[req.body.sid].mapStr = req.body.mapStr;
            }
            if (req.body.maxPlayers) {
                _this.serversCFG[req.body.sid].maxPlayers = req.body.maxPlayers;
            }
            if (req.body.GSLTToken != undefined) {
                _this.serversCFG[req.body.sid].GSLTToken = req.body.GSLTToken;
                if (_this.serversCFG[req.body.sid].GSLTToken == null || _this.serversCFG[req.body.sid].GSLTToken.length < 5) {
                    _this.serversCFG[req.body.sid].GSLTToken = undefined;
                }
            }
            if (req.body.GameStats) {
                _this.serversCFG[req.body.sid].GameStats = req.body.GameStats == 'true';
                console.log("update gameStats ", _this.serversCFG[req.body.sid].GameStats, typeof _this.serversCFG[req.body.sid].GameStats);
            }
            if (req.body.cheats) {
                _this.serversCFG[req.body.sid].cheats = req.body.cheats == 'true';
                console.log("update cheats ", _this.serversCFG[req.body.sid].cheats, typeof _this.serversCFG[req.body.sid].cheats);
            }
            _this.Servers[req.body.sid].updateCfg(_this.serversCFG[req.body.sid]);
            //serversCFG
            _this.saveServerConfigs();
            res.send("okay");
        });
        app.post('/getIniFile', function (req, res) {
            console.log("getIniFile");
            console.log(req.body);
            if (!authC.auth(req, res)) {
                res.send("error: auth");
                return;
            }
            if (req.body.sid == undefined || _this.Servers[req.body.sid] == undefined)
                return res.send("err server Not Found");
            _this.Servers[req.body.sid].fileReader.getIniFile(req.body.ini, function (data) {
                res.send(data);
            });
        });
        app.post('/setIniFile', function (req, res) {
            console.log("setIniFile");
            console.log(req.body);
            if (!authC.auth(req, res)) {
                res.send("error: auth");
                return;
            }
            if (req.body.sid == undefined || _this.Servers[req.body.sid] == undefined)
                return res.send("err server Not Found");
            _this.Servers[req.body.sid].fileReader.setIniFile(req.body.ini, req.body.data);
        });
        app.post('/updateRconSpam', function (req, res) {
            if (!authC.auth(req, res)) {
                res.send("error: auth");
                return;
            }
            if (req.body.sid == undefined || _this.Servers[req.body.sid] == undefined)
                return res.send("err server Not Found");
            console.log("updateRconSpam", req.body);
            if (req.body.data.rep == 0) {
                console.log("stopSpamQuery");
                _this.Servers[req.body.sid].stopRconSpam();
                return;
            }
            if (_this.Servers[req.body.sid].rconSpam != undefined) {
                if (req.body.data.msgs != undefined)
                    _this.Servers[req.body.sid].rconSpam.setArray(req.body.data.msgs.split('\n'));
                _this.Servers[req.body.sid].rconSpam.setDelay(req.body.data.delay);
            }
            else {
                _this.Servers[req.body.sid].startRconSpam(req.body.data.msgs.split('\n'), +req.body.data.delay);
            }
            _this.serversCFG[req.body.sid] = _this.Servers[req.body.sid].getServerCfg();
            _this.saveServerConfigs();
            res.send('okay');
        });
        app.post('/getRconSpam', function (req, res) {
            if (!authC.auth(req, res)) {
                res.send("error: auth");
                return;
            }
            res.send(_this.serversCFG[req.body.sid].rconSpam);
        });
    };
    srvManager.prototype.saveServerConfigs = function () {
        var dataStr = JSON.stringify(this.serversCFG, null, 2);
        fs.writeFileSync('./servers.json', dataStr);
    };
    return srvManager;
}());

var cfg$2 = require("./cfg.json");
var serversCFG = require('./servers.json');
var srvMgr = new srvManager(serversCFG);
var app = express();
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// serve files from the public directory
app.use(express.static('public'));
authC.use(app);
srvMgr.use(app);
// start the express web server listening on 8080
app.listen(cfg$2.WebPort, function () {
    console.log('listening on ' + cfg$2.WebPort);
});
// serve the homepage
app.get('/', function (req, res) {
    if (!authC.auth(req, res)) {
        return;
    }
    res.sendFile(__dirname + '/public/main.html');
});
app.get('/test', function (req, res) {
    if (!authC.auth(req, res)) {
        return;
    }
    console.log('Cookies: ', req.cookies.auth);
    console.log('Signed Cookies: ', req.signedCookies);
    res.sendFile(__dirname + '/public/index.html');
});
