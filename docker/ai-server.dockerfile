FROM python:3.9-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    ffmpeg \
    libsm6 \
    libxext6 \
    && rm -rf /var/lib/apt/lists/*

# Upgrade pip
RUN pip install --upgrade pip

# Copy requirements.txt
COPY ai-service/requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the AI service code
COPY ai-service/ .

# Create directories if they don't exist
RUN mkdir -p models data

# Expose the port
EXPOSE 8000

# Start the AI service
CMD ["python", "-m", "api.main"]