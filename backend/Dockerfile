FROM python:3.10-slim

WORKDIR /app

# Copy requirements and install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy entire backend
COPY . .

# Set environment variables
ENV PORT=8000

# Expose port and start uvicorn
EXPOSE ${PORT}
CMD ["sh", "-c", "uvicorn main:app --host 0.0.0.0 --port ${PORT}"]
