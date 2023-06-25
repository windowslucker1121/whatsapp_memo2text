console.log("App is booting up")

const qrcode = require('qrcode-terminal');
const { ClientConstructor } = require('./client_constructor.js');
const { MessageTypes } = require("whatsapp-web.js");
const { Website } = require('./website.js');
const { summarizeVoiceMessage } = require("./summarize.js")



const client = process.argv.indexOf("headless") !== -1 ?
    ClientConstructor.getHeadlessClient() :
    ClientConstructor.getNormalClient();


client.on('qr', qr => {
    console.log("No saved auth data found. Booting up webservice... ");
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log("Client is ready and listening.");
});

// Emitted when a new message is created, which may include the current user's own messages.
client.on('message_create', async message => {
    const contactName = (await message.getContact()).pushname;
    console.log(`Received a message_create event from ${contactName}`)

    if (message.body == "!ping") {
        message.reply("pong");
        return;
    }

    if (message.hasMedia && message.type === MessageTypes.AUDIO) {
        console.log("Received audio message. Starting download...");

        const media = await message.downloadMedia();

        if (media !== undefined) {
            const logMessage = `Media information:\n  Filename: ${media.filename}\n  Type: ${media.mimetype}\n  Size: ${media.filesize}`;
            console.log(logMessage);

            const data_buffer = Buffer.from(media.data, 'base64')
            const data_blob = new Blob([data_buffer])
            const summary = await summarizeVoiceMessage(data_blob, media.mimetype)

            console.log(`Summary: ${summary}`)
            message.reply(`Zusammenfassung:\n\n${summary}`)
        }
        else {
            console.log("ERROR: media is somehow corrupted/deleted.");
        }
    }
    else {
        const messageBody = message.body;
        console.log(contactName + ": " + messageBody);
    }
})

client.initialize();

