const dgram = require('dgram');
const server = dgram.createSocket('udp4');
const controller = require('./clientController');

// Global Variable
var cliCont = undefined;

// Controller input AGV data
var AGVInp = [
	{
		"id": "1",
		"ip": "192.168.43.121",
		"port": "4210",
		"battery": "60"
	},
	{
		"id": "2",
		"ip": "192.168.43.129",
		"port": "4210",
		"battery": "40"
	}
]

server.on('error', (err) => {
	console.log(`server error:\n${err.stack}`);
	server.close();
});

server.on('message', (msg, rinfo) => {
	console.log(`server got: ${msg} from ${rinfo.address}:${rinfo.port}`);
	var text = `${msg}`;

	// If AGV Requests Command
	if(text.split(":")[0] == "request"){
		var id = parseInt(text.split(":")[1]) - 1;
		var battery = parseInt(text.split(":")[2]);
		if(battery < 50){
			cliCont.stateChange(id, "straight")
			.then((msg) => {
				setTimeout(() => {
					cliCont.stateChange(id, "charging");
				}, 2000);
			})
		}
		else{
			cliCont.stateChange(id, "left");
		}
	}

	if(text.split(":")[0] == "batterylow"){
		cliCont.batteryLow(text.split(":")[1]);
		// cliCont.sendAll()
	}
});

server.on('listening', () => {
  const address = server.address();
  console.log(`server listening ${address.address}:${address.port}`);
});

server.bind("3030", "192.168.43.91", () => {
    cliCont = new controller(AGVInp);
});