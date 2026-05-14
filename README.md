# SMS Guard AI

A high-fidelity SMS spam and fraud detection system powered by Gemini 3 Flash.

## Project Structure
- `frontend/`: React + Vite application with glassmorphism UI.
- `backend/`: FastAPI server with Gemini integration.

## Getting Started

### Prerequisites
- Python 3.10+
- Node.js & npm

### One-Click Launch (Windows)
- Run `start_backend.bat` to start the classification engine.
- Run `start_frontend.bat` to launch the user interface.

### Manual Launch
1. **Backend**:
   ```bash
   cd backend
   python -m venv .venv
   .\.venv\Scripts\activate
   pip install -r requirements.txt
   python main.py
   ```

2. **Frontend**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

## API Endpoint
- `POST http://localhost:8000/classify`
- Body: `{"text": "SMS Message Here"}`
- Returns: Structured JSON with category, confidence, and reasoning.
