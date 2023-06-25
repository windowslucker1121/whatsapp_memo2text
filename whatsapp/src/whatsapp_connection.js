console.log("App is booting up")

const qrcode = require('qrcode-terminal');
const { ClientConstructor } = require('./client_constructor.js');
const { MessageTypes } = require("whatsapp-web.js");
const { Website } = require('./website.js');
const { summarizeVoiceMessage, summarizeText } = require("./summarize.js")



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
    if (!message.fromMe) {
        console.log("Ignoring message because it was not be us")
        return;
    }

    if (message.body == "!ping") {
        message.reply("pong");
        return;
    } else if (message.body == "!summarize" || message.body == "!s") {
        console.log(`Handling command message ${JSON.stringify(message)}`)

        const quoted = await message.getQuotedMessage();
        if (!quoted) {
            message.reply("Summarize needs a quoted message...")
            return;
        }

        if (quoted.type === MessageTypes.AUDIO || quoted.type === MessageTypes.VOICE) {
            await handleVoiceMessage(quoted)
        }
        else if (quoted.type === MessageTypes.TEXT) {
            await handleTextMessage(quoted)
        }
        else {
            console.warn(`Cannot handle message type ${quoted.type}`)
        }

    }
})

const handleVoiceMessage = async function(message) {
    console.log("Handling voice message...")

    if (!message.hasMedia) {
        console.error("Voice message does not have media, this is unexpected")
        return;
    }

    const media = await message.downloadMedia();

    if (!media) {
        console.error("Voice message could not be downloaded");
        return;
    }

    const logMessage = `Media information:\n  Filename: ${media.filename}\n  Type: ${media.mimetype}\n  Size: ${media.filesize}`;
    console.log(logMessage);

    const data_buffer = Buffer.from(media.data, 'base64')
    const data_blob = new Blob([data_buffer])
    const summary = await summarizeVoiceMessage(data_blob, media.mimetype)
    message.reply(`Zusammenfassung:\n\n${summary}`)
}

const handleTextMessage = async function(message) {
    console.log("Handling text message...")
    const summary = await summarizeText(message.body)
    message.reply(`Zusammenfassung:\n\n${summary}`)
}

client.initialize();

