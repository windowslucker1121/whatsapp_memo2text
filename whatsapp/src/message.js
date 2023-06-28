const urlRegex = require('url-regex');
const checkForLinkInMessage = async function (textMessage , forceReturn) {
    //check for link in message and check if the link is the major part of the message
    const regex = urlRegex();
    const matches = textMessage.match(regex);

    if (matches && matches.length > 0) {
        const link = matches[0];
        
        if (link.length >= textMessage.length / 2 || forceReturn) {
            return link;
        }
    }
    return null;
}
module.exports = { checkForLinkInMessage };