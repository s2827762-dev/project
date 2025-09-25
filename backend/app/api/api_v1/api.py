from fastapi import APIRouter

from app.api.api_v1.endpoints import auth, users, medicines, appointments, records, symptoms, devices, points

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["authentication"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(medicines.router, prefix="/medicines", tags=["medicines"])
api_router.include_router(appointments.router, prefix="/appointments", tags=["appointments"])
api_router.include_router(records.router, prefix="/records", tags=["health-records"])
api_router.include_router(symptoms.router, prefix="/symptoms", tags=["symptoms"])
api_router.include_router(devices.router, prefix="/devices", tags=["devices"])
api_router.include_router(points.router, prefix="/points", tags=["health-points"])