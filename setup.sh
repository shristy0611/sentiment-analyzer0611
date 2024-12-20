#!/bin/bash

# Create Python virtual environment
python3 -m venv venv

# Activate virtual environment
source venv/bin/activate

# Install Python dependencies
pip install fastapi uvicorn groq python-dotenv

# Install Node.js dependencies
npm install

# Create a new terminal window and start the backend server
osascript -e 'tell app "Terminal"
  do script "cd '$(pwd)' && source venv/bin/activate && cd backend && uvicorn main:app --reload --host 0.0.0.0 --port 8000"
end tell'

# Start the frontend server
npm run dev
