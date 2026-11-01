FROM python:3.12-slim
ENV PYTHONUNBUFFERED=1 PORT=8080
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY main.py .
CMD exec functions-framework --target=generate_metadata --signature-type=cloudevent --port=$PORT
