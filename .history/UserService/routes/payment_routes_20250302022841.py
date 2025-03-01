import requests
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter()

PAYMENT_SERVICE_URL = "http://localhost:5004/payments"  
BOOKING_SERVICE_URL = "http://localhost:5003/bookings"  # Update this URL accordingly

class PaymentRequest(BaseModel):
    user_id: int
    booking_id: int
    amount: float

@router.get("/payments", tags=["Payments"])
def get_payments():
    """Fetch all payments from the Payment Service"""
    try:
        response = requests.get(PAYMENT_SERVICE_URL)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=500, detail=f"Payment Service Unavailable: {str(e)}")

@router.post("/payments", tags=["Payments"])
def process_payment(payment: PaymentRequest):
    """Process payment and update booking status"""
    try:
        # Step 1: Send payment request to the Payment Service
        payment_data = payment.dict()
        print(f"🔹 Sending Payment Data: {payment_data}")
        
        payment_response = requests.post(PAYMENT_SERVICE_URL, json=payment_data)
        print(f"🔹 Payment Response: {payment_response.status_code}, {payment_response.text}")
        payment_response.raise_for_status()

        # Step 2: Check if the payment was successful
        if payment_response.status_code != 200:
            raise HTTPException(status_code=400, detail="Payment failed.")

        # Step 3: Update the booking status to "completed" if payment was successful
        booking_update = {"status": "completed"}
        print(f"🔹 Updating booking {payment.booking_id} to status: completed")
        
        booking_response = requests.put(f"{BOOKING_SERVICE_URL}/{payment.booking_id}", json=booking_update)
        print(f"🔹 Booking Update Response: {booking_response.status_code}, {booking_response.text}")
        booking_response.raise_for_status()

        # Step 4: Return the successful payment and booking update response
        return {
            "message": "Payment processed and booking updated successfully!",
            "payment": payment_response.json(),
            "booking": booking_response.json()
        }

    except requests.exceptions.RequestException as e:
        print(f"❌ Payment/Booking Update Error: {e}")
        raise HTTPException(status_code=500, detail=f"Payment processing failed: {str(e)}")
