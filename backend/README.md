# Maize Guard AI - Backend

This is the FastAPI backend that serves the custom `.h5` model for Maize leaf disease detection.

## Local Setup

1. Install Python 3.9+
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Make sure the model exists at `model/Maizeplant_disease_model.h5`
4. Run the server:
   ```bash
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

## Connect React Frontend
When running locally, set your `.env` or Vercel Environment variables for the frontend:
```env
VITE_FASTAPI_URL=http://localhost:8000
```
(Replace with your deployed backend URL when in production).

## Deployment (Render or Railway)
This app is ready to deploy on any Python-friendly host. 
For Render:
- Create a new "Web Service"
- Connect your GitHub repo, source folder `backend`
- Build Command: `pip install -r requirements.txt`
- Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
- Ensure you upload the `.h5` model file to the correct path in the repo!
