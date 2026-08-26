# The Node API server and the queue worker both need to run
# backend/ai/analyze.py (numpy/Pillow/scipy), which a plain Node
# buildpack does not provide. This image installs both runtimes.
FROM node:22-slim

# System Python 3 + pip, used by src/lib/resolvePython.js
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 \
    python3-pip \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install Node dependencies first (better layer caching)
COPY package*.json ./
RUN npm install --omit=dev

# Install Python dependencies for the AI analysis script
COPY ai/requirements.txt ./ai/requirements.txt
RUN pip3 install --break-system-packages --no-cache-dir -r ai/requirements.txt

# Now copy the rest of the backend source
COPY . .

RUN mkdir -p uploads/analysis

ENV PYTHON_BIN=python3
ENV PORT=4000
EXPOSE 4000

# Overridden by render.yaml's startCommand per-service (web vs worker)
CMD ["node", "src/server.js"]
