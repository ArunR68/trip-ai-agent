# TourAI – AI Travel Agent & Smart Trip Planner

TourAI is an intelligent, full-stack travel assistant that transforms natural-language travel desires into complete, realistic day-wise itineraries, verified budget breakdowns, and live weather advisories.

## Key Features

- **Natural-Language Travel Chat**: Speak to TourAI just like a human travel agent (e.g. *“I have ₹5000 and 2 days. I'm in Coimbatore. I like nature places. Suggest a trip.”*). The AI extracts key preferences and asks follow-up questions when necessary.
- **Smart Destination Recommendation & Rationale**: Recommends destinations that logically match your starting hub, budget, and desired pace, explicitly explaining the rationale.
- **Day-Wise Itinerary & Place Cards**: Morning, afternoon, and evening schedules with detailed cards showing opening hours, ticket entry fees, activities, and nearby spots.
- **Live vs. Estimated Data Transparency**: Clearly distinguishes live information (real-time weather from Open-Meteo) from estimated figures (standard tariffs and bus/cab rates).
- **Comprehensive Budget Breakdown**: Itemizes transportation, accommodation, food, tickets, and miscellaneous buffer against your stated budget with instant remaining balance calculations.
- **Interactive Travel Toolkit**: Live weather widgets, hotel & dining options, transit route options, printable PDF-ready view, and saved trips history.

## Project Structure

```
TourAI/
├── frontend/ (src/)
│   ├── components/      # Modular React UI components
│   ├── services/        # Frontend API client
│   ├── types.ts         # Shared TypeScript interfaces
│   ├── App.tsx          # Main application coordinator
│   └── main.tsx         # Root DOM bootstrap
├── backend/
│   ├── app.py           # Python FastAPI backend entry point
├── services/
│   └── weather_service.py # Live weather service (Open-Meteo)
├── ai/
│   └── gemini_planner.py  # Gemini API planner module
├── database/
│   └── mongo_client.py    # MongoDB persistent storage client
├── server.ts            # High-performance Node.js / Express server (runs in AI Studio)
├── server/
│   ├── geminiService.ts # Server-side Gemini API integration
│   ├── travelData.ts    # Curated knowledge base and verified presets
│   └── weatherService.ts# Open-Meteo live integration
├── requirements.txt     # Python backend dependencies
└── .env.example         # Environment variables configuration
```

## Running the Application

### 1. In AI Studio / Node.js Environment (Default)
The container runs the full-stack Node.js + Express backend with Vite middleware on port 3000:
```bash
npm run dev
```

### 2. Running Python FastAPI + MongoDB Stack (Alternative)
To run the Python backend separately:
```bash
pip install -r requirements.txt
uvicorn backend.app:app --host 0.0.0.0 --port 8000 --reload
```
