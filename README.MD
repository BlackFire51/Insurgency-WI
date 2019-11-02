# SimpleNodejsWebinterface for Insurgency
This is a very simple web interface for Managing an Insurgency Sandstorm Server.
This Project was designed with Linux(Ubuntu 16) in mind but should work on other Systems as well

# Installation
## Install tools
git
```
sudo apt install git
```
[Nodejs](https://nodejs.org/en/download/package-manager/)

#### Using Ubuntu
```
curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash -
sudo apt-get update
sudo apt-get install -y nodejs
```

## Clone repository
```
cd /srv/
mkdir sandstormWebinterface
git clone https://github.com/BlackFire51/Insurgency-WI.git sandstormWebinterface
```
### Install required packages
```
cd /srv/sandstormWebinterface
npm i
```
#Customize the config
```
cd /srv/sandstormWebinterface
cp cfg.json.template cfg.json
cp servers.json.template servers.json
nano cfg.json
```

  




## Start the program
```
npm run server
```

it is recommended to **run the program** and therefore the gameserver **not as root**.


# Config


the config file is provired as templade to not interfere with git

## cfg.json

```
{
	"WebPort":8888, // Http Port the webinterface can be reached under 
	"SteamCmd":{
		"exec":"./steamcmd.sh" , // steam executable 
		"Directory":"/srv/steamcmd/"  // path to your steam folder for auto updates
	},
	"loginCredentials":[
		{"username":"admin","password":"admin"} // login for the webinterface 
	]
}
```
## server.json

```
[
  {
    "name": "Servername",
    "ip": "127.0.0.1",  // ip for the query to reach 127.0.0.1 sould be fine !!!
    "port": 27015, // gameport of the server other Ports are calulated based on this port (leave 10 Ports "space" between servers
    "maxPlayers": "8",
    "appId": 581330, // steam appid of sandstorm 
    "dir": "/path/to/sandstorm/server/",  // path to the game server
    "exec": "./Insurgency/Binaries/Linux/InsurgencyServer-Linux-Shipping", // executable sould be fine 
    "rcon": "changeme", // rcon password for teh query client
    "password": null, // server password set null if you dont want any else set "changeme" with qouts at start and and of the password and dont miss the comma (,) on the line end
    "mapStr": "Sinjar?Scenario=Scenario_Hillside_Checkpoint_Security", // map string witch map and scenario is used, this is subject to change in further iterrations
    "game": "CheckpointHardcore", // gamemode 
    "GameStats": true,
    "cheats": false
  }
]
```

for mutible servers :
```
[
  {
    "name": "Servername",
    "ip": "127.0.0.1",
    "port": 27015,
    "maxPlayers": "8",
    "appId": 581330,
    "dir": "/path/to/sandstorm/server/",
    "exec": "./Insurgency/Binaries/Linux/InsurgencyServer-Linux-Shipping",
    "rcon": "changeme",
    "password": null,
    "mapStr": "Sinjar?Scenario=Scenario_Hillside_Checkpoint_Security",
    "game": "CheckpointHardcore",
    "GameStats": true,
    "cheats": false
  },
  {
    "name": "Servername2",
    "ip": "127.0.0.1",
    "port": 27025,
    "maxPlayers": "8",
    "appId": 581330,
    "dir": "/path/to/sandstorm/server2/",
    "exec": "./Insurgency/Binaries/Linux/InsurgencyServer-Linux-Shipping",
    "rcon": "changeme",
    "password": null,
    "mapStr": "Sinjar?Scenario=Scenario_Hillside_Checkpoint_Security",
    "game": "CheckpointHardcore",
    "GameStats": true,
    "cheats": false
  }
]
```