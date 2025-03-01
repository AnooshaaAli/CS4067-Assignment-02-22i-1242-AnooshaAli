import requests
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter()

PAYMENT_SERVICE_URL = "http://localhost:5004/api/payments"  

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
