const AGVClient = require('./client');

class clientController {
  constructor(agvInp) {
    this._AGVlist = [];
    agvInp.forEach((agv) => {
      this._AGVlist.push(new AGVClient(agv.ip, agv.port, agv.id, agv.battery));
    });
  }

  stateChange(id, msg) {
    return new Promise((resolve, reject) => {
      this._AGVlist[id].sendMessage(msg)
        .then(() => {
          console.log(`${msg} sent to ${id}`);
          resolve('done');
        })
        .catch((err) => {
          console.log(err);
          reject(err);
        });
    });
  }

  batteryLow(idS) {
    let i = 0;
    const id = parseInt(idS) - 1;
    console.log(`${idS} : ${id}`);
    this._AGVlist.forEach((agv) => {
      if (i !== id) {
        agv.sendMessage('uncharge');
      }
      i += 1;
    });
    this._AGVlist[id].sendMessage('stop')
      .then((msg) => {
        console.log(`${id} stopped because of battery low`);
      });
  }

  sendAll() {
    this._AGVlist.forEach((agv) => {
      agv.sendMessage('straight')
        .then(() => {
          setTimeout(() => {
            agv.sendMessage('stop');
          }, 2000);
        });
    });
  }
}

module.exports = clientController;
