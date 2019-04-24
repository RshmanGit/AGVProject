const dgram = require('dgram');
const message = Buffer.from('on');
const server = dgram.createSocket('udp4');

server.send(message, "4210", "192.168.43.121", () => {
    console.log("Message Sent");
    server.close();
})