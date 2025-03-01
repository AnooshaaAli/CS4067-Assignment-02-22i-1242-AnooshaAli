import requests
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter()

BOOKING_SERVICE_URL = "http://localhost:5003/api/bookings"  # Booking Service Base URL

class BookingRequest(BaseModel):
    user_id: int
    event_id: int
    tickets: int

@router.get("/bookings", tags=["Bookings"])
def get_bookings():
    """Fetch all bookings from the Booking Service"""
    try:
        response = requests.get(BOOKING_SERVICE_URL)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=500, detail=f"Booking Service Unavailable: {str(e)}")


@router.post("/bookings", tags=["Bookings"])
def create_booking(booking: BookingRequest):
    """Send booking request to the Booking Service"""
    try:
        booking_data = booking.dict()

        print(f"🔹 Sending Booking Data: {booking_data}")  # Debugging

        response = requests.post(BOOKING_SERVICE_URL, json=booking_data)

        print(f"🔹 Response Status Code: {response.status_code}")  # Debugging
        print(f"🔹 Response Content: {response.text}")  # Debugging

        response.raise_for_status()  # Raises an error if response is not 2xx

        return {"message": "Booking created successfully!", "booking": response.json()}
    except requests.exceptions.RequestException as e:
        print(f"❌ Error: {e}")  # Debugging
        raise HTTPException(status_code=500, detail=f"Failed to create booking: {str(e)}")

@router.patch("/bookings/{booking_id}", tags=["Bookings"])
def update_booking(booking_id: int, data: dict):
    """Update a booking in the Booking Service"""
    try:
        # Using PATCH instead of PUT if partial update is intended
        response = requests.patch(f"{BOOKING_SERVICE_URL}/{booking_id}", json=data)
        print(f"🔹 Response Status Code: {response.status_code}")  # Debugging
        print(f"🔹 Response Content: {response.text}")  # Debugging
        
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"❌ Error: {e}")  # Debugging
        raise HTTPException(status_code=500, detail=f"Failed to update booking: {str(e)}")

    """Update a booking in the Booking Service"""
    try:
        response = requests.put(f"{BOOKING_SERVICE_URL}/{booking_id}", json=data)
        print(f"🔹 Response Status Code: {response.status_code}")  # Debugging
        print(f"🔹 Response Content: {response.text}")  # Debugging
        
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"❌ Error: {e}")  # Debugging
        raise HTTPException(status_code=500, detail=f"Failed to update booking: {str(e)}")