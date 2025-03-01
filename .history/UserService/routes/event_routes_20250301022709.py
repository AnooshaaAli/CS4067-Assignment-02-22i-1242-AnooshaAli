import requests
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter()

EVENT_SERVICE_URL = "http://localhost:5002/api/events"  # Event Service Base URL

# Define the request model
class EventRequest(BaseModel):
    title: str
    description: str
    location: str
    price: float

@router.get("/events", tags=["Events"])
def get_events():
    """Fetch all events from the Event Service"""
    try:
        response = requests.get(EVENT_SERVICE_URL)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=500, detail=f"Event Service Unavailable: {str(e)}")


@router.post("/add-event", tags=["Events"])
def add_event(event: EventRequest):
    """Send event data to the Event Service"""
    try:
        response = requests.post(EVENT_SERVICE_URL, json=event.dict())
        response.raise_for_status()
        return {"message": "Event added successfully!", "event": response.json()}
    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=500, detail=f"Failed to add event: {str(e)}")
