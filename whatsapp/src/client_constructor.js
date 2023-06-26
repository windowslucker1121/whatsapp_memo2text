const { Client, LocalAuth } = require('whatsapp-web.js');

class ClientConstructor {
    static getHeadlessClient() {
        console.log("Provided headless argument.")
        return new Client(
            {
                authStrategy: new LocalAuth(
                    {
                        clientId: "self",
                        dataPath: "/data",
                    }
                ),
                puppeteer: {
                    // TODO: Why does headless mean no sandbox?
                    args: ['--no-sandbox'],
                }
            }
        );
    }

    static getNormalClient() {
        console.log("Creating normal Client.")
        return new Client(
            {
                authStrategy: new LocalAuth(
                    {
                        clientId: "self"
                    }
                ),
            }
        );
    }
}

module.exports = { ClientConstructor };
