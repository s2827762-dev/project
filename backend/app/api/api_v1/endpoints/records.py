from fastapi import APIRouter

router = APIRouter()

@router.get("/")
def get_health_records():
    return [
        {
            "id": 1,
            "consultation_date": "2024-09-20T00:00:00Z",
            "doctor_name": "Dr. Sharma",
            "consultation_type": "General Consultation",
            "is_locked": False,
            "summary": "Patient reported mild headache and fatigue. Prescribed rest and hydration."
        },
        {
            "id": 2,
            "consultation_date": "2024-09-15T00:00:00Z",
            "doctor_name": "Dr. Patel",
            "consultation_type": "Follow-up",
            "is_locked": True
        }
    ]

@router.post("/{record_id}/unlock")
def unlock_record(record_id: int, qr_key: str):
    return {"message": f"Record {record_id} unlocked successfully"}