FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .

RUN apt-get update && \
apt-get install -y curl && \
pip install --no-cache-dir -r requirements.txt && \
apt-get clean && \
rm -rf /var/lib/apt/lists/*

COPY . .

COPY entrypoint.sh /entrypoint.sh

RUN chmod +x /entrypoint.sh

EXPOSE 8000

ENTRYPOINT ["/entrypoint.sh"]

CMD sh -c "uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}"
