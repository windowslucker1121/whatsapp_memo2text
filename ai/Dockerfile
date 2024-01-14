FROM python:3.12

WORKDIR /app

RUN apt-get update && \
    apt-get install -y ffmpeg

COPY requirements.txt .
RUN pip install --trusted-host pypi.python.org -r requirements.txt

COPY . .
EXPOSE 5000

CMD ["python", "-m", "flask", "--app=main", "run", "--debug", "--host=0.0.0.0"]
