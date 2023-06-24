const express = require('express');
const QRCode = require('qrcode');
class website {
    constructor(data) {
        this.data = data;
        this.app = express();
        this.port = 3000;

        this.setupRoutes();
        this.startServer();
    }

    setupRoutes() {
        this.app.get('/', (req, res) => {
            QRCode.toDataURL(this.data, (err, url) => {
                if (err) {
                    res.send('Error while generating QR Code: ' + err.toString());
                } else {
                    res.send(`Please scan the QR Code with the \"Linked Devices\" Feature.\n\n <img src="${url}" alt="QR-Code">`);
                }
            });
        });
    }

    startServer() {
        this.app.listen(this.port, () => {
            
            //TODO how to acquire dockers container ip?
            const containerIp = 'localhost';
            const consoleLogString = `QR Code ready to scan on ${containerIp}:${this.port}`;
            console.log(consoleLogString);
        });
    }
}

module.exports = { website };