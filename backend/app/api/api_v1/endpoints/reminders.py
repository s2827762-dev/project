from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from pydantic import BaseModel

from app.core.database import get_db
from app.models.reminder import Reminder
from app.models.medicine import Medicine

router = APIRouter()

# Pydantic models
class ReminderCreate(BaseModel):
    medicine_id: int
    time: str  # HH:MM format
    frequency: str  # morning, afternoon, night
    enabled: bool = True
    sound: bool = True
    snooze_minutes: int = 10

class ReminderUpdate(BaseModel):
    time: str = None
    frequency: str = None
    enabled: bool = None
    sound: bool = None
    snooze_minutes: int = None

class ReminderResponse(BaseModel):
    id: int
    medicine_id: int
    user_id: int
    time: str
    frequency: str
    enabled: bool
    sound: bool
    snooze_minutes: int
    medicine_name: str = None
    medicine_dosage: str = None

    class Config:
        from_attributes = True

@router.get("/", response_model=List[ReminderResponse])
async def get_reminders(
    medicine_id: int = None,
    user_id: int = 1,  # Default user for demo
    db: Session = Depends(get_db)
):
    """Get all reminders for a user, optionally filtered by medicine"""
    query = db.query(Reminder).filter(Reminder.user_id == user_id)
    
    if medicine_id:
        query = query.filter(Reminder.medicine_id == medicine_id)
    
    reminders = query.all()
    
    # Enrich with medicine details
    result = []
    for reminder in reminders:
        medicine = db.query(Medicine).filter(Medicine.id == reminder.medicine_id).first()
        reminder_dict = {
            "id": reminder.id,
            "medicine_id": reminder.medicine_id,
            "user_id": reminder.user_id,
            "time": reminder.time,
            "frequency": reminder.frequency,
            "enabled": reminder.enabled,
            "sound": reminder.sound,
            "snooze_minutes": reminder.snooze_minutes,
            "medicine_name": medicine.name if medicine else None,
            "medicine_dosage": medicine.dosage if medicine else None
        }
        result.append(ReminderResponse(**reminder_dict))
    
    return result

@router.post("/", response_model=ReminderResponse)
async def create_reminder(
    reminder: ReminderCreate,
    user_id: int = 1,  # Default user for demo
    db: Session = Depends(get_db)
):
    """Create a new medicine reminder"""
    
    # Verify medicine exists
    medicine = db.query(Medicine).filter(Medicine.id == reminder.medicine_id).first()
    if not medicine:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Medicine not found"
        )
    
    # Check if reminder already exists for this medicine and frequency
    existing = db.query(Reminder).filter(
        Reminder.medicine_id == reminder.medicine_id,
        Reminder.user_id == user_id,
        Reminder.frequency == reminder.frequency
    ).first()
    
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Reminder already exists for {reminder.frequency}"
        )
    
    # Create new reminder
    db_reminder = Reminder(
        medicine_id=reminder.medicine_id,
        user_id=user_id,
        time=reminder.time,
        frequency=reminder.frequency,
        enabled=reminder.enabled,
        sound=reminder.sound,
        snooze_minutes=reminder.snooze_minutes
    )
    
    db.add(db_reminder)
    db.commit()
    db.refresh(db_reminder)
    
    # Return with medicine details
    return ReminderResponse(
        id=db_reminder.id,
        medicine_id=db_reminder.medicine_id,
        user_id=db_reminder.user_id,
        time=db_reminder.time,
        frequency=db_reminder.frequency,
        enabled=db_reminder.enabled,
        sound=db_reminder.sound,
        snooze_minutes=db_reminder.snooze_minutes,
        medicine_name=medicine.name,
        medicine_dosage=medicine.dosage
    )

@router.get("/{reminder_id}", response_model=ReminderResponse)
async def get_reminder(
    reminder_id: int,
    user_id: int = 1,  # Default user for demo
    db: Session = Depends(get_db)
):
    """Get a specific reminder"""
    reminder = db.query(Reminder).filter(
        Reminder.id == reminder_id,
        Reminder.user_id == user_id
    ).first()
    
    if not reminder:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Reminder not found"
        )
    
    medicine = db.query(Medicine).filter(Medicine.id == reminder.medicine_id).first()
    
    return ReminderResponse(
        id=reminder.id,
        medicine_id=reminder.medicine_id,
        user_id=reminder.user_id,
        time=reminder.time,
        frequency=reminder.frequency,
        enabled=reminder.enabled,
        sound=reminder.sound,
        snooze_minutes=reminder.snooze_minutes,
        medicine_name=medicine.name if medicine else None,
        medicine_dosage=medicine.dosage if medicine else None
    )

@router.put("/{reminder_id}", response_model=ReminderResponse)
async def update_reminder(
    reminder_id: int,
    reminder_update: ReminderUpdate,
    user_id: int = 1,  # Default user for demo
    db: Session = Depends(get_db)
):
    """Update a reminder"""
    reminder = db.query(Reminder).filter(
        Reminder.id == reminder_id,
        Reminder.user_id == user_id
    ).first()
    
    if not reminder:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Reminder not found"
        )
    
    # Update fields
    update_data = reminder_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(reminder, field, value)
    
    db.commit()
    db.refresh(reminder)
    
    medicine = db.query(Medicine).filter(Medicine.id == reminder.medicine_id).first()
    
    return ReminderResponse(
        id=reminder.id,
        medicine_id=reminder.medicine_id,
        user_id=reminder.user_id,
        time=reminder.time,
        frequency=reminder.frequency,
        enabled=reminder.enabled,
        sound=reminder.sound,
        snooze_minutes=reminder.snooze_minutes,
        medicine_name=medicine.name if medicine else None,
        medicine_dosage=medicine.dosage if medicine else None
    )

@router.delete("/{reminder_id}")
async def delete_reminder(
    reminder_id: int,
    user_id: int = 1,  # Default user for demo
    db: Session = Depends(get_db)
):
    """Delete a reminder"""
    reminder = db.query(Reminder).filter(
        Reminder.id == reminder_id,
        Reminder.user_id == user_id
    ).first()
    
    if not reminder:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Reminder not found"
        )
    
    db.delete(reminder)
    db.commit()
    
    return {"message": "Reminder deleted successfully"}

@router.post("/{reminder_id}/toggle")
async def toggle_reminder(
    reminder_id: int,
    user_id: int = 1,  # Default user for demo
    db: Session = Depends(get_db)
):
    """Toggle reminder enabled/disabled status"""
    reminder = db.query(Reminder).filter(
        Reminder.id == reminder_id,
        Reminder.user_id == user_id
    ).first()
    
    if not reminder:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Reminder not found"
        )
    
    reminder.enabled = not reminder.enabled
    db.commit()
    
    return {
        "message": f"Reminder {'enabled' if reminder.enabled else 'disabled'}",
        "enabled": reminder.enabled
    }