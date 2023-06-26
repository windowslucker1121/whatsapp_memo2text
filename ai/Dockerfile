FROM python:3.11-slim-buster

WORKDIR /app

COPY . /app

RUN apt-get update && \
    apt-get install -y ffmpeg && \
    pip install --trusted-host pypi.python.org -r requirements.txt

EXPOSE 5000

CMD ["python", "-m", "flask", "--app=main", "run", "--debug", "--host=0.0.0.0"]
