# Sentiment Analyzer

A modern web application for analyzing text sentiment using advanced AI models.

## Features

- Real-time sentiment analysis using Llama 3.3
- Beautiful visualization of sentiment scores
- Responsive design with modern UI
- FastAPI backend with Python ML capabilities

## Setup

### Backend Setup

1. Install Python dependencies:
```bash
pip install -r requirements.txt
```

2. Set up environment variables:
- Copy `.env.example` to `.env`
- Add your Groq API key to `.env`

3. Start the backend server:
```bash
cd backend
uvicorn main:app --reload
```

### Frontend Setup

1. Install Node.js dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

## Usage

1. Open your browser to `http://localhost:3000`
2. Enter text in the input field
3. Click "Analyze Sentiment"
4. View the sentiment analysis results with visualization

## Tech Stack

- Frontend: Next.js, React, Tailwind CSS, Recharts
- Backend: FastAPI, Groq (Llama 3.3)
- Language: TypeScript, Python
