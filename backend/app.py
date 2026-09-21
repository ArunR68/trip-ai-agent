from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import os
from dotenv import load_dotenv

from services.weather_service import get_live_weather
from ai.gemini_planner import generate_plan_with_gemini
from database.mongo_client import save_trip_to_db, get_saved_trips_from_db

load_dotenv()

app = FastAPI(title="TourAI - AI Travel Agent API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    message: str
    history: Optional[List[dict]] = []

class PlanRequest(BaseModel):
    startingLocation: Optional[str] = "Coimbatore"
    budget: Optional[float] = 5000
    currency: Optional[str] = "₹"
    durationDays: Optional[int] = 2
    peopleCount: Optional[int] = 1
    interests: Optional[List[str]] = ["Nature"]
    preferredDestination: Optional[str] = None

@app.get("/api/health")
def health():
    return {"status": "ok", "service": "TourAI Python Backend"}

@app.get("/api/weather")
def weather(location: str = "Ooty"):
    return get_live_weather(location)

@app.post("/api/plan")
def plan(req: PlanRequest):
    criteria = req.model_dump()
    plan_data = generate_plan_with_gemini(criteria)
    weather_data = get_live_weather(plan_data.get("destination", "Ooty"))
    plan_data["weather"] = weather_data
    save_trip_to_db(plan_data)
    return plan_data

@app.get("/api/trips")
def get_trips():
    return get_saved_trips_from_db()
