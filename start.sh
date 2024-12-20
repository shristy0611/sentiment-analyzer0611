#!/bin/bash

# Activate virtual environment
source venv/bin/activate

# Start backend server in a new terminal window
osascript -e 'tell app "Terminal"
  do script "cd '$(pwd)' && source venv/bin/activate && cd backend && uvicorn main:app --reload --host 0.0.0.0 --port 8000"
end tell'

# Start frontend server
npm run dev
