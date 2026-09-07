# AI Leftover Chef

AI Leftover Chef turns ingredients you already have into practical recipe ideas. Enter your leftover ingredients, add optional dietary preferences and serving requirements, and the app generates a structured recipe using OpenRouter.

## Features

- Generate recipes from leftover ingredients
- Specify dietary preferences or restrictions
- Choose between 1 and 20 servings
- Receive ingredients, instructions, cooking time, and serving information
- React and TypeScript frontend
- FastAPI backend with OpenRouter integration

## Tech Stack

- **Frontend:** React, TypeScript, Vite, Tailwind CSS, Framer Motion
- **Backend:** Python, FastAPI, Pydantic, httpx
- **AI provider:** OpenRouter

## Project Structure

```text
backend/    FastAPI application and AI integration
frontend/   React and TypeScript web application
```

## Prerequisites

- Python 3.10 or newer
- Node.js 18 or newer
- An OpenRouter API key

## Configuration

Create `backend/.env` with your OpenRouter credentials:

```env
OPENROUTER_API_KEY=your_openrouter_api_key
OPENROUTER_MODEL=openrouter/free
```

You can replace `OPENROUTER_MODEL` with another model available through OpenRouter.

## Run the Backend

From the repository root:

```bash
cd backend
python -m venv venv
```

Activate the virtual environment:

```bash
# macOS/Linux/Git Bash
source venv/Scripts/activate

# Windows PowerShell
.\venv\Scripts\Activate.ps1
```

Install dependencies and start the API:

```bash
pip install -r requirements.txt
python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

The backend will be available at:

- Health check: `http://127.0.0.1:8000/`
- Interactive API docs: `http://127.0.0.1:8000/docs`
- Recipe endpoint: `POST http://127.0.0.1:8000/api/recipes/generate`

## Run the Frontend

Open a second terminal from the repository root:

```bash
cd frontend
npm install
npm run dev
```

Open the URL printed by Vite, normally `http://localhost:5173`.

## API Example

Request:

```json
{
  "ingredients": ["rice", "eggs", "spinach"],
  "dietary_preferences": "vegetarian",
  "servings": 2
}
```

The response contains the generated recipe:

```json
{
  "title": "Spinach Egg Fried Rice",
  "description": "A quick and satisfying way to use leftover rice.",
  "ingredients": ["rice", "eggs", "spinach"],
  "instructions": ["..."],
  "cooking_time_minutes": 20,
  "servings": 2
}
```

## Development Commands

Run these commands from `frontend/`:

```bash
npm run dev       # Start the Vite development server
npm run build     # Type-check and create a production build
npm run lint      # Run Oxlint
npm run preview   # Preview the production build
```

Run this command from `backend/` to validate Python syntax:

```bash
python -m compileall -q app
```

## Troubleshooting

- **Missing API key:** Confirm `backend/.env` contains `OPENROUTER_API_KEY` and restart the backend.
- **Frontend cannot reach the API:** Make sure the backend is running on `127.0.0.1:8000`.
- **Recipe generation returns an upstream error:** Check the OpenRouter model name, API key permissions, and backend terminal logs.
- **Port already in use:** Stop the process using port `8000` or `5173`, or start the relevant service on another port and update the frontend API URL if needed.

## License

No license has been specified for this project yet.
