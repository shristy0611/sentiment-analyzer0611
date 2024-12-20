#!/bin/bash

# Activate virtual environment
source venv/bin/activate

# Install dependencies
pip install fastapi uvicorn groq python-dotenv

# Start the backend server
cd backend
python3 -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
