const qrcode = require('qrcode-terminal');

const { Client, LocalAuth } = require('whatsapp-web.js');
const client = new Client(
    {
        authStrategy : new LocalAuth(
            {
                clientId: "self"
            }
        )
    }
);

client.on('qr', qr => {
    qrcode.generate(qr, {small: true});
});

client.on('ready', () => {
    console.log('Client is ready!');
});

client.on('message', async message => {
    const stringContactName = (await message.getContact()).pushname;
    
    if(message.hasMedia) {
        console.log("Received media. Starting download.");
        const media = await message.downloadMedia();
        if(media == undefined )
        {
            Console.log("ERROR: media is somehow corrupted/deleted.");
        }
        else
        {
            console.log("MediaInformation: \n   filename: " + media.fileName +
                "\ntype: " + media.mimetype +
                "\nfilesize: " + media.filesize +
                "\ndata: " + media.data);
        }
        
        // do something with the media data here
    }
    else
    {
        const messageBody = message.body;
        console.log (stringContactName + ": " + messageBody);
    }
    
    

    

});
 
client.initialize();
 