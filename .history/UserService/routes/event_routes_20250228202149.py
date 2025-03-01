import requests
from fastapi import APIRouter, HTTPException

router = APIRouter()

EVENT_SERVICE_URL = "http://localhost:5002/api/events"  # Update this if your Event Service URL is different

@router.get("/events", tags=["Events"])
def get_events():
    try:
        response = requests.get(EVENT_SERVICE_URL)
        response.raise_for_status()  # Raises HTTPError for bad responses (4xx and 5xx)
        return response.json()
    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=500, detail=f"Event Service Unavailable: {str(e)}")
