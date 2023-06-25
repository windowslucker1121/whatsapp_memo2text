import logging
import os

from aiohttp import ClientSession, FormData
from flask import Flask, abort, request
from tools.transcode import transcode

logging.basicConfig(level=logging.DEBUG)

# Constants
OPENAI_API_KEY = os.environ["OPENAI_API_KEY"]
WHISPER_URL = "https://api.openai.com/v1/audio/transcriptions"
CHATGPT_URL = "https://api.openai.com/v1/chat/completions"

SUMMARIZE_SYSTEM_PROMPT = """
Du bist ein Assistent, der sehr kurze und prägnante Zusammenfassungen von Nachrichten erstellt.
Die Zusammenfassungen sollen so kurz wie möglich sein und keine unwichtigen Details enthalten.
Insbesondere sollten sie keine Grußformeln, Verabschiedungen, Glückwünsche, Grüße oder Vergleichbares enthalten.
Die einzige Ausgabe soll die zusammengefasste Nachricht in Stichpunkten sein.
"""

logging.debug(f"OpenAI API key: {OPENAI_API_KEY}")

app = Flask(__name__)


async def call_whisper(filename: str, data: bytes, mimetype: str):
    form_data = FormData()
    form_data.add_field("file", data, filename=filename, content_type=mimetype)
    form_data.add_field("model", "whisper-1")

    async with ClientSession() as session:
        headers = {"Authorization": f"Bearer {OPENAI_API_KEY}"}

        async with session.post(
                url=WHISPER_URL,
                headers=headers,
                data=form_data) as response:
            logging.debug(f"Whisper response: {response.status}, {await response.text()}")
            response.raise_for_status()
            return await response.json()


async def call_chatgpt(system_prompt: str, prompt: str):
    logging.debug(f"Calling ChatGPT with prompt {prompt}")

    async with ClientSession() as session:
        headers = {"Authorization": f"Bearer {OPENAI_API_KEY}"}
        json = {
            "model": "gpt-3.5-turbo",
            "messages": [
                {
                    "role": "system",
                    "content": system_prompt,
                },
                {
                    "role": "user",
                    "content": prompt,
                }
            ]}

        async with session.post(
                url=CHATGPT_URL,
                headers=headers,
                json=json) as response:
            logging.debug(f"ChatGPT response: {response.status}, {await response.text()}")
            response.raise_for_status()
            return await response.json()


@ app.route("/transcribe", methods=["POST"])
async def transcribe():
    logging.debug("Doing transcription")

    files = request.files

    if len(files) != 1:
        abort(400, "Exactly one file needs to be given")

    file = next(iter(files.values()))
    data = file.read()
    filename = file.filename
    mime_type = file.mimetype

    logging.debug(
        f"Received file {filename} with type {mime_type} and {len(data)} bytes of data")

    if mime_type != "audio/mpeg":
        data, filename = transcode(data, mime_type, "audio/mpeg")
        mime_type = "audio/mpeg"
        logging.debug(
            f"Transcoded data to {filename} ({mime_type}) with {len(data)} bytes of data")

    result = await call_whisper(filename, data, mime_type)
    transcription = result["text"]

    return {
        "transcription": transcription,
    }


@ app.route("/summarize", methods=["POST"])
async def summarize():
    logging.debug("Summarizing")

    json = request.get_json()
    text = json["text"]

    chatgpt_result = await call_chatgpt(SUMMARIZE_SYSTEM_PROMPT, text)
    summary = chatgpt_result["choices"][0]["message"]["content"]

    return {
        "summary": summary
    }
