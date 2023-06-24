console.log("App is booting up")

const qrcode = require('qrcode-terminal');
const { client_constructor } = require('./client_constructor.js');
const { MessageTypes } = require("whatsapp-web.js");
const { website } = require('./website.js');



const client = process.argv.indexOf("--headless") !== -1 ? client_constructor.getHeadlessClient() : client_constructor.getNormalClient();


client.on('qr', qr => {
    console.log("No saved auth data found. Booting up webservice... ");
    var qrCodeWebsite = new website(qr);
    qrcode.generate(qr, {small: true});
});

client.on('ready', () => {
    console.log("Client is ready and listening.");
});

client.on('message', async message => {
    const stringContactName = (await message.getContact()).pushname;
    
    if(message.hasMedia && message.type === MessageTypes.AUDIO) {
        
        console.log("Received audio message. Starting download...");
        const media = await message.downloadMedia();
        if(media !== undefined )
        {
            console.log("MediaInformation: \n   filename: " + media.fileName +
                "\ntype: " + media.mimetype +
                "\nfilesize: " + media.filesize);
                // "\ndata: " + media.data);
        }
        else
            console.log("ERROR: media is somehow corrupted/deleted.");
    }
    else
    {
        const messageBody = message.body;
        console.log (stringContactName + " : " + messageBody);
    }
});
 
client.initialize();
 