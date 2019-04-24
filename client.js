const dgram = require('dgram');
const clientListener = dgram.createSocket('udp4');

class clientAGV {
    constructor(address, port, id, battery){
        console.log(`Client Registered ${address}:${port} id:${id}`)
        this._address = address;
        this._port = port;
        this._id = id;
        this.clientSetup(id, battery);
    }

    clientSetup(id, battery){
        this.sendMessage("start")
        .then((msg) => {
            console.log("Start Sent");
            setTimeout(() => {
                this.sendMessage(id)
                .then(()=>{
                    console.log("ID Sent");
                    setTimeout(() => {
                        this.sendMessage(battery)
                        .then(()=>{
                            console.log("Battery Sent");
                            setTimeout(() => {
                                this.sendMessage("straight");
                            }, 2000);
                        })
                    }, 2000);
                })
            }, 2000);
        })
        .catch((err)=>{
            console.log("Error Occured");
            console.log(err);
        })
    }

    sendMessage(message){
        return new Promise((resolve, reject)=>{
            clientListener.send(message, this._port, this._address, (err) => {
                if(err){
                    reject(err);
                }
                else{
                    resolve(`Sent Message ${message} : ${this._id}`);
                }
            })
        })
    }
}

module.exports= clientAGV;