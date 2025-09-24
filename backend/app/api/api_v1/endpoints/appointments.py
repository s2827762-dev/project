from fastapi import APIRouter

router = APIRouter()

@router.get("/")
def get_appointments():
    return [
        {
            "id": 1,
            "doctor_name": "Dr. Sharma",
            "appointment_date": "2024-09-25T10:00:00Z",
            "appointment_type": "tele-consult",
            "status": "scheduled",
            "meet_link": "https://meet.google.com/abc-defg-hij"
        },
        {
            "id": 2,
            "doctor_name": "Dr. Patel",
            "appointment_date": "2024-09-28T14:30:00Z",
            "appointment_type": "in-person",
            "status": "scheduled",
            "clinic_name": "City Health Center"
        }
    ]