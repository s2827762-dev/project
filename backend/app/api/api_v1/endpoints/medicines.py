from typing import List, Any
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.medicine import Medicine, MedicineLog
from app.schemas.medicine import MedicineResponse, MedicineCreate, MedicineLogResponse

router = APIRouter()


@router.get("/", response_model=List[MedicineResponse])
def get_medicines(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
) -> Any:
    """
    Retrieve medicines (mock data for now)
    """
    # Mock data for testing
    mock_medicines = [
        {
            "id": 1,
            "user_id": 1,
            "name": "Paracetamol",
            "dosage": "500mg",
            "frequency": "morning,afternoon,night",
            "instructions": "Take after meals",
            "start_date": "2024-09-20T00:00:00Z",
            "end_date": None,
            "morning_time": "08:00",
            "afternoon_time": "14:00",
            "night_time": "21:00",
            "is_active": True,
            "prescribed_by": "Dr. Sharma",
            "prescription_date": "2024-09-20T00:00:00Z",
            "created_at": "2024-09-20T00:00:00Z",
            "updated_at": None
        },
        {
            "id": 2,
            "user_id": 1,
            "name": "Vitamin D",
            "dosage": "1000 IU",
            "frequency": "morning",
            "instructions": "Take with water",
            "start_date": "2024-09-20T00:00:00Z",
            "end_date": None,
            "morning_time": "08:00",
            "afternoon_time": None,
            "night_time": None,
            "is_active": True,
            "prescribed_by": "Dr. Patel",
            "prescription_date": "2024-09-20T00:00:00Z",
            "created_at": "2024-09-20T00:00:00Z",
            "updated_at": None
        }
    ]
    
    return mock_medicines


@router.get("/logs", response_model=List[MedicineLogResponse])
def get_medicine_logs(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
) -> Any:
    """
    Retrieve medicine logs (mock data for now)
    """
    # Mock data for testing
    mock_logs = [
        {
            "id": 1,
            "user_id": 1,
            "medicine_id": 1,
            "scheduled_time": "2024-09-24T08:00:00Z",
            "taken_time": "2024-09-24T08:15:00Z",
            "status": "taken",
            "notes": None,
            "side_effects": None,
            "created_at": "2024-09-24T08:15:00Z"
        },
        {
            "id": 2,
            "user_id": 1,
            "medicine_id": 2,
            "scheduled_time": "2024-09-24T08:00:00Z",
            "taken_time": "2024-09-24T08:10:00Z",
            "status": "taken",
            "notes": None,
            "side_effects": None,
            "created_at": "2024-09-24T08:10:00Z"
        }
    ]
    
    return mock_logs


@router.post("/log", response_model=dict)
def log_medicine_taken(
    medicine_id: int,
    status: str = "taken",
    db: Session = Depends(get_db)
) -> Any:
    """
    Log medicine as taken/missed
    """
    return {
        "message": f"Medicine {medicine_id} logged as {status}",
        "points_earned": 10 if status == "taken" else 0
    }