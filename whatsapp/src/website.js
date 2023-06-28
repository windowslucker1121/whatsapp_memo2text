const express = require('express');
const QRCode = require('qrcode');
const axios = require('axios');
const cheerio = require('cheerio');

class Website {
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
    async function fetchWebsiteText(link) {
        try {
            const response = await axios.get(link);
            const html = response.data;
            const $ = cheerio.load(html);
            
            return $('body').text();
        } catch (error) {
            console.error('Error while fetching website:', error);
            return null;
        }
    
}
module.exports = { Website, fetchWebsiteText };
