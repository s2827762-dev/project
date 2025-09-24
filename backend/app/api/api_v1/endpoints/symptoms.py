from fastapi import APIRouter

router = APIRouter()

@router.get("/")
def get_symptoms():
    return {"message": "Symptoms endpoint - coming soon"}

@router.post("/")
def log_symptom():
    return {"message": "Symptom logged successfully", "points_earned": 15}