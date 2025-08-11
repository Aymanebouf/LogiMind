# syntax=docker/dockerfile:1
FROM python:3.11-slim

WORKDIR /app

# Install deps
COPY requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

# App source
COPY app /app/app
COPY .env /app/.env  # facultatif en local; en prod, injecte via secrets

EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
