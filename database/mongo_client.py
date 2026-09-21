import os
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
DB_NAME = os.getenv("MONGO_DB_NAME", "tourai_db")

client = None
db = None

def get_database():
    global client, db
    if db is None:
        try:
            client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=2000)
            db = client[DB_NAME]
        except Exception as e:
            print(f"MongoDB connection error (running in local in-memory fallback): {e}")
            return None
    return db

def save_trip_to_db(trip_dict: dict):
    database = get_database()
    if database is not None:
        return database.trips.replace_one({"id": trip_dict["id"]}, trip_dict, upsert=True)
    return None

def get_saved_trips_from_db():
    database = get_database()
    if database is not None:
        return list(database.trips.find({}, {"_id": 0}))
    return []
