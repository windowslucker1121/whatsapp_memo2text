import logging
import subprocess
from mimetypes import guess_extension
from pathlib import Path
from tempfile import TemporaryDirectory


def transcode(input_data: bytes, input_mime_type: str, output_mime_type: str) -> bytes:
    logging.debug("Transcoding file from {} to {}".format(
                  input_mime_type, output_mime_type))

    with TemporaryDirectory() as tmpdir:
        working_directory = Path(tmpdir)

        input_file_name = f"input{guess_extension(input_mime_type)}"
        output_file_name = f"output{guess_extension(output_mime_type)}"

        input_file_path = working_directory.joinpath(input_file_name)
        output_file_path = working_directory.joinpath(output_file_name)

        logging.debug(f"Input file {input_file_path}")
        logging.debug(f"Output file {output_file_path}")

        # Write input file
        with open(input_file_path, "wb") as input_file:
            input_file.write(input_data)

        # Transcode
        subprocess.check_call(
            ["ffmpeg", "-i", input_file_path, output_file_path])

        # Return output file
        with open(output_file_path, "rb") as output_file:
            return output_file.read(), output_file_name
