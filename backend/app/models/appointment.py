from sqlalchemy import Column, Integer, String, DateTime, Boolean, Text, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from app.core.database import Base


class Appointment(Base):
    __tablename__ = "appointments"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # Appointment details
    doctor_name = Column(String(100), nullable=False)
    doctor_specialization = Column(String(100))
    clinic_name = Column(String(200))
    clinic_address = Column(Text)
    
    # Schedule
    appointment_date = Column(DateTime(timezone=True), nullable=False)
    duration_minutes = Column(Integer, default=30)
    
    # Type and status
    appointment_type = Column(String(20), nullable=False)  # "in-person", "tele-consult"
    status = Column(String(20), default="scheduled")  # "scheduled", "completed", "cancelled", "no-show"
    
    # Tele-consultation
    meet_link = Column(String(500))
    meet_id = Column(String(100))
    
    # Additional info
    reason = Column(Text)
    notes = Column(Text)
    
    # Reminders
    reminder_sent = Column(Boolean, default=False)
    reminder_time = Column(DateTime(timezone=True))
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    user = relationship("User", back_populates="appointments")