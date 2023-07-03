# Whatsapp Memo2Text

A solution to summarize and/or transcribe whatsapp audio messages and long text messages.

Dont waste time with long (audio) messages and summarize them using OpenAI.

# Getting started
1. Copy `docker-compose.yml` to your device. 
2. Copy `secrets.env.example` to your device ,  rename it to `secrets.env` and pdate paste your OpenAI API Key.
3. Run `docker compose up -d`
4. Visit the container on port 3000 or check the container logs. You'll find a QR code that you have to scan.
5. Open Whatsapp on your phone and scan the displayed QR code.

# Usage
Currently you can either transcribe voice messages or summary both text and voice messages. 
Reply to any message you want to be summarized / transcribed with one of the commands below.

## Commands 
- `!p` or `!ping` to check if the service is up. The container will respond with "pong"
- `!t` or `!transcribe` to let OpenAI trancribe a voice message. The container will respond with the transcribed message.
- `!s`or `!summarize` to let OpenAI summarize a text or voice message. 

# Disclaimer
This container will send text messages that you respond to with one of the commands above to OpenAI. 