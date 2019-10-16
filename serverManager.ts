import InsurgencyServer from './InsurgencyServer'
import { ServerStatus, ServerStatusInternal } from './enums';
import express from 'express'
import auth from './auth'
import fs from 'fs'

export default class srvManager {
	private Servers: any[]
	private serversCFG: any

	constructor(serversCFG: any) {
		this.serversCFG = serversCFG
		this.Servers=[]
		for (let i = 0; i < serversCFG.length; i++) {
			const s = serversCFG[i];
			this.Servers[i] = new InsurgencyServer(i, s)

		}
	}

	use(app: express.Application) {
		app.post('/start', (req, res) => {
			console.log("Start")
			console.log(req.body)
			if (!auth.auth(req, res)) { res.send("error: auth"); return; }
			if (req.body.sid == undefined || this.Servers[req.body.sid] == undefined) return res.send("err server Not Found");

			let s = this.Servers[req.body.sid].getStatus();
			if (s != ServerStatus.Stoped && s != ServerStatus.Crashed) {
				res.send("error: status");
				return;
			}
			console.log('body: ', req.body)
			this.Servers[req.body.sid].Start();
			res.send("ok");

		});
		app.post('/stop', (req, res) => {
			console.log(req.body)
			if (!auth.auth(req, res)) { res.send("error: auth"); return; }
			if (req.body.sid == undefined || this.Servers[req.body.sid] == undefined) return res.send("err server Not Found");
			console.log("Stop")
			let s = this.Servers[req.body.sid].getStatus();
			if (s != ServerStatus.Running) {
				res.send("error: status");
				return;
			}
			console.log('Cookies: ', req.cookies)

			this.Servers[req.body.sid].Stop();
			res.send("ok");

		});

		app.post('/kill', (req, res) => {
			console.log(req.body)
			if (!auth.auth(req, res)) { res.send("error: auth"); return; }
			if (req.body.sid == undefined || this.Servers[req.body.sid] == undefined) return res.send("err server Not Found");

			console.log("kill")
			let s = this.Servers[req.body.sid].getStatus();
			if (s != ServerStatus.Running) {
				res.send("error: status");
				return;
			}
			console.log('Cookies: ', req.cookies)
			this.Servers[req.body.sid].Kill();
			res.send("ok");

		});

		app.post('/update', (req, res) => {
			if (!auth.auth(req, res)) { res.send("error: auth"); return; }
			if (req.body.sid == undefined || this.Servers[req.body.sid] == undefined) return res.send("err server Not Found");

			console.log("update")
			let s = this.Servers[req.body.sid].getStatus();
			if (s != ServerStatus.Stoped && s != ServerStatus.Crashed) {
				res.send("error: status");
				return;
			}
			console.log('Cookies: ', req.cookies)

			this.Servers[req.body.sid].Update();
			res.send("ok");

		});

		app.post('/status', (req, res) => {
			if (!auth.auth(req, res)) { res.send("error: auth"); return; }
			console.log("Status")
			if (req.body.sid == undefined || this.Servers[req.body.sid] == undefined) return res.send("err server Not Found");

			let str = this.Servers[req.body.sid].getStatus().toString();
			console.log(str);
			res.send(str);
		});

		app.post('/serverStats', (req, res) => {
			if (!auth.auth(req, res)) { res.send("error: auth"); return; }
			if (req.body.sid == undefined || this.Servers[req.body.sid] == undefined) return res.send("err server Not Found");
			//console.log("serverStats")
			let data = this.Servers[req.body.sid].getData()
			if (data == undefined) {
				res.send("error: no data avalable");
			} else {
				res.send(data);
			}
		});

		app.post('/consoleLog', (req, res) => {
			if (!auth.auth(req, res)) { res.send("error: auth"); return; }

			//console.log("ConsoleLog")
			//console.log(req.body);
			if (req.body.sid == undefined || this.Servers[req.body.sid] == undefined) return res.send("err");
			let log = undefined;
			if (req.body.ptr != undefined) {
				log = this.Servers[req.body.sid].log.getLogSince(req.body.ptr);
			} else {
				log = this.Servers[req.body.sid].log.getLog();
			}
			log.status = this.Servers[req.body.sid].getStatus()
			res.send(log);
		});

		//##############################
		app.post('/getServerList', (req, res) => {
			if (!auth.auth(req, res)) { res.send("error: auth"); return; }

			res.send(this.serversCFG);
		});
		app.post('/updateCfg', (req, res) => {
			if (!auth.auth(req, res)) { res.send("error: auth"); return; }
			console.log('updateCfg: ', req.body)
			if (this.serversCFG[req.body.sid] == undefined) return;

			if (req.body.name) {
				this.serversCFG[req.body.sid].name = req.body.name
			}
			if (req.body.rcon) {
				this.serversCFG[req.body.sid].rcon = req.body.rcon
			}
			if (req.body.password != undefined) {
				if (req.body.password.length > 0) {
					this.serversCFG[req.body.sid].password = req.body.password
				} else {
					this.serversCFG[req.body.sid].password = null
				}
			}
			if (req.body.game != undefined) {
				if (req.body.game.length > 0) {
					this.serversCFG[req.body.sid].game = req.body.game
				} else {
					this.serversCFG[req.body.sid].game = null
				}
			}
			if (req.body.mapStr) {
				this.serversCFG[req.body.sid].mapStr = req.body.mapStr
			}
			if (req.body.maxPlayers) {
				this.serversCFG[req.body.sid].maxPlayers = req.body.maxPlayers
			}
			if (req.body.GSLTToken != undefined) {
				this.serversCFG[req.body.sid].GSLTToken = req.body.GSLTToken
				if (this.serversCFG[req.body.sid].GSLTToken == null || this.serversCFG[req.body.sid].GSLTToken.length < 5) {
					this.serversCFG[req.body.sid].GSLTToken = undefined;
				}
			}
			if (req.body.GameStats) {
				this.serversCFG[req.body.sid].GameStats = req.body.GameStats == 'true'
				console.log("update gameStats ", this.serversCFG[req.body.sid].GameStats, typeof this.serversCFG[req.body.sid].GameStats)
			}
			if (req.body.cheats) {
				this.serversCFG[req.body.sid].cheats = req.body.cheats == 'true'
				console.log("update cheats ", this.serversCFG[req.body.sid].cheats, typeof this.serversCFG[req.body.sid].cheats)
			}
			this.Servers[req.body.sid].updateCfg(this.serversCFG[req.body.sid])
			//serversCFG
			let dataStr = JSON.stringify(this.serversCFG, null, 2);
			fs.writeFileSync('./servers.json', dataStr);

			res.send("okay")
		});

		app.post('/getIniFile', (req, res) => {
			console.log("getIniFile")
			console.log(req.body)
			if(!auth.auth(req, res)) { res.send("error: auth");return;}
			if(req.body.sid==undefined || this.Servers[req.body.sid]==undefined) return res.send("err server Not Found");
			
			this.Servers[req.body.sid].fileReader.getIniFile(req.body.ini,(data)=>{
				res.send(data);
			});
		});
		app.post('/setIniFile', (req, res) => {
			console.log("setIniFile")
			console.log(req.body)
			if(!auth.auth(req, res)) { res.send("error: auth");return;}
			if(req.body.sid==undefined || this.Servers[req.body.sid]==undefined) return res.send("err server Not Found");
			
			this.Servers[req.body.sid].fileReader.setIniFile(req.body.ini,req.body.data);
		});
	}
}