import requests
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter()

PAYMENT_SERVICE_URL = "http://localhost:5004/payments"  

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
def create_payment(payment: PaymentRequest):
    """Send payment request to the Payment Service"""
    try:
        payment_data = payment.dict()

        print(f"🔹 Sending Payment Data: {payment_data}")  # Debugging

        response = requests.post(PAYMENT_SERVICE_URL, json=payment_data)

        print(f"🔹 Response Status Code: {response.status_code}")  # Debugging
        print(f"🔹 Response Content: {response.text}")  # Debugging

        response.raise_for_status()  # Raises an error if response is not 2xx

        return {"message": "Payment processed successfully!", "payment": response.json()}
    except requests.exceptions.RequestException as e:
        print(f"❌ Error: {e}")  # Debugging
        raise HTTPException(status_code=500, detail=f"Failed to process payment: {str(e)}")

@router.post("/payments", tags=["Payments"])
def process_payment(payment: PaymentRequest):
    """Process payment and update booking status"""
    PAYMENT_SERVICE_URL = "http://localhost:5004/api/payments"
    
    try:
        # 1. Call the payment service
        payment_data = payment.dict()
        print(f"🔹 Sending Payment Data: {payment_data}")
        
        payment_response = requests.post(PAYMENT_SERVICE_URL, json=payment_data)
        print(f"🔹 Payment Response: {payment_response.status_code}, {payment_response.text}")
        payment_response.raise_for_status()
        
        # 2. Update the booking status to "completed" if payment was successful
        booking_update = {"status": "completed"}
        print(f"🔹 Updating booking {payment.booking_id} to status: completed")
        
        booking_response = requests.put(f"{BOOKING_SERVICE_URL}/{payment.booking_id}", json=booking_update)
        print(f"🔹 Booking Update Response: {booking_response.status_code}, {booking_response.text}")
        booking_response.raise_for_status()
        
        # Return both the payment and updated booking information
        return {
            "message": "Payment processed and booking updated successfully!",
            "payment": payment_response.json(),
            "booking": booking_response.json()
        }
    except requests.exceptions.RequestException as e:
        print(f"❌ Payment/Booking Update Error: {e}")
        raise HTTPException(status_code=500, detail=f"Payment processing failed: {str(e)}")