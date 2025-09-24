from typing import Optional
from datetime import datetime
from pydantic import BaseModel


class MedicineBase(BaseModel):
    name: str
    dosage: str
    frequency: str
    instructions: Optional[str] = None
    morning_time: Optional[str] = None
    afternoon_time: Optional[str] = None
    night_time: Optional[str] = None
    prescribed_by: Optional[str] = None


class MedicineCreate(MedicineBase):
    user_id: int
    start_date: datetime
    end_date: Optional[datetime] = None
    prescription_date: Optional[datetime] = None


class MedicineUpdate(BaseModel):
    name: Optional[str] = None
    dosage: Optional[str] = None
    frequency: Optional[str] = None
    instructions: Optional[str] = None
    morning_time: Optional[str] = None
    afternoon_time: Optional[str] = None
    night_time: Optional[str] = None
    is_active: Optional[bool] = None


class MedicineResponse(MedicineBase):
    id: int
    user_id: int
    start_date: datetime
    end_date: Optional[datetime] = None
    is_active: bool
    prescription_date: Optional[datetime] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class MedicineLogBase(BaseModel):
    scheduled_time: datetime
    status: str
    notes: Optional[str] = None
    side_effects: Optional[str] = None


class MedicineLogCreate(MedicineLogBase):
    user_id: int
    medicine_id: int
    taken_time: Optional[datetime] = None


class MedicineLogResponse(MedicineLogBase):
    id: int
    user_id: int
    medicine_id: int
    taken_time: Optional[datetime] = None
    created_at: datetime

    class Config:
        from_attributes = True