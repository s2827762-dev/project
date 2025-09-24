from fastapi import APIRouter

router = APIRouter()

@router.get("/")
def get_device_data():
    return {"message": "Device data endpoint - coming soon"}

@router.post("/sync")
def sync_device_data():
    return {"message": "Device data synced successfully"}