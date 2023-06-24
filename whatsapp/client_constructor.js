const { Client, LocalAuth } = require('whatsapp-web.js');
class client_constructor {
    static getHeadlessClient()
    {
        console.log("Provided headless argument.")
        return new Client(
            {
                authStrategy : new LocalAuth(
                    {
                        clientId: "self"
                    }
                ),
                puppeteer: {
                    args: ['--no-sandbox'],
                }
            }
        );
    }
    
    static getNormalClient()
    {
        console.log("Creating normal Client.")
        return new Client(
            {
                authStrategy : new LocalAuth(
                    {
                        clientId: "self"
                    }
                ),
            }
        );
    }
}
module.exports = { client_constructor };