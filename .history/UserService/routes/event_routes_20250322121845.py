import requests
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from datetime import datetime

router = APIRouter()

EVENT_SERVICE_URL = "http://event-service:5002/api/events"  # Event Service Base URL

class EventRequest(BaseModel):
    title: str
    description: str
    date: str  # Include date field
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
        event_data = event.dict()

        print(f"🔹 Sending Event Data: {event_data}")  # Debugging

        response = requests.post(EVENT_SERVICE_URL, json=event_data)

        print(f"🔹 Response Status Code: {response.status_code}")  # Debugging
        print(f"🔹 Response Content: {response.text}")  # Debugging

        response.raise_for_status()  # Raises an error if response is not 2xx

        return {"message": "Event added successfully!", "event": response.json()}
    except requests.exceptions.RequestException as e:
        print(f"❌ Error: {e}")  # Debugging
        raise HTTPException(status_code=500, detail=f"Failed to add event: {str(e)}")