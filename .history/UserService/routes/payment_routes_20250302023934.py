import requests
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter()

PAYMENT_SERVICE_URL = "http://localhost:5004/payments"
BOOKING_SERVICE_URL = "http://localhost:5003/api/bookings"  # Update URL if needed

class PaymentRequest(BaseModel):
    user_id: int
    booking_id: int
    amount: float

@router.post("/payments", tags=["Payments"])
def process_payment(payment: PaymentRequest):
    """Process payment and update booking status"""
    try:
        # Step 1: Send payment request to the Payment Service
        payment_data = payment.dict()
        print(f"🔹 Sending Payment Data: {payment_data}")

        payment_response = requests.post(PAYMENT_SERVICE_URL, json=payment_data)

        # Debugging response from payment service
        print(f"🔹 Payment Response Status Code: {payment_response.status_code}")
        print(f"🔹 Payment Response Content: {payment_response.text}")

        # Parse the payment JSON response
        payment_json = payment_response.json()
        print(f"🔹 Payment JSON: {payment_json}")

        # Check if payment was successful
        if payment_response.status_code != 200 or payment_json.get("payment", {}).get("status") != "Success":
            raise HTTPException(status_code=400, detail=f"Payment failed: {payment_json}")

        # Step 2: Update the booking status to "completed" if payment was successful
        booking_update = {"status": "completed"}
        print(f"🔹 Updating booking {payment.booking_id} to status: completed")

        booking_response = requests.put(f"{BOOKING_SERVICE_URL}/{payment.booking_id}", json=booking_update)

        # Debugging the booking update response
        print(f"🔹 Booking Update Response Status Code: {booking_response.status_code}")
        print(f"🔹 Booking Update Response Content: {booking_response.text}")

        # Ensure booking status update is successful
        if booking_response.status_code != 200:
            raise HTTPException(status_code=400, detail=f"Failed to update booking: {booking_response.text}")

        booking_response.raise_for_status()

        # Step 3: Return the successful payment and booking update response
        return {
            "message": "Payment processed and booking updated successfully!",
            "payment": payment_json,
            "booking": booking_response.json()
        }

    except requests.exceptions.RequestException as e:
        print(f"❌ Payment/Booking Update Error: {e}")
        raise HTTPException(status_code=500, detail=f"Payment processing failed: {str(e)}")
