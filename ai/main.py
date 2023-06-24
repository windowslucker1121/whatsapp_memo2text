import logging
import os

from aiohttp import ClientSession, FormData
from flask import Flask, abort, request

logging.basicConfig(level=logging.DEBUG)

# Constants
OPENAI_API_KEY = os.environ["OPENAI_API_KEY"]
WHISPER_URL = "https://api.openai.com/v1/audio/transcriptions"

logging.debug(f"OpenAI API key: {OPENAI_API_KEY}")

app = Flask(__name__)


async def transcribe(filename: str, data: bytes, mimetype: str):
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
            return await response.text()


@app.route("/transcribe", methods=["POST"])
async def asr():
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

    return await transcribe(filename, data, mime_type)
