console.log("App is booting up")

const qrcode = require('qrcode-terminal');
const { ClientConstructor } = require('./client_constructor.js');
const { MessageTypes } = require("whatsapp-web.js");
const { fetchWebsiteText } = require('./website.js');
const { checkForLinkInMessage } = require('./message.js');
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

    const [command, ...params] = message.body.split(' ');

    switch (command) {
        case "!p":
        case "!ping":
        {
            await message.reply("pong");
            return;
        }
        case "!summarize":
        case "!s": {
            
            console.log(`Handling command message ${JSON.stringify(message)} with given parameters: ` + params)

            const quoted = await message.getQuotedMessage();
            if (!quoted) {
                message.reply("Summarize needs a quoted message...")
                return;
            }

            if (quoted.type === MessageTypes.AUDIO || quoted.type === MessageTypes.VOICE) {
                await handleVoiceMessage(quoted)
            }
            else if (quoted.type === MessageTypes.TEXT) {
                
                await handleTextMessage(quoted,params)
            }
            else {
                console.warn(`Cannot handle message type ${quoted.type}`)
            }
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
    message.reply(`Summary:\n\n${summary}`)
}

const handleTextMessage = async function(message,parameter) {
    console.log("Handling text message...")
    let summarizeMessage = message.body;
    let forceParameter = !!(typeof parameter === 'object' && Array.isArray(parameter) && parameter.includes('f'));
    
    let link = await checkForLinkInMessage(summarizeMessage, forceParameter);
    if ( link != null)
    {
        console.log("Detected http(s) link which is not the main content of the message, scanning link...")
        let bodyOfWebsite = await fetchWebsiteText(link)
        console.log ("Fetched body: \n" + bodyOfWebsite);
        // summarizeMessage = bodyOfWebsite;
    }
    const summary = await summarizeText(summarizeMessage)
    message.reply(`Summary:\n\n${summary}`)
}

client.initialize();

