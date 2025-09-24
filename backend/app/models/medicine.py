from sqlalchemy import Column, Integer, String, DateTime, Boolean, Text, ForeignKey, Float
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from app.core.database import Base


class Medicine(Base):
    __tablename__ = "medicines"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    name = Column(String(200), nullable=False)
    dosage = Column(String(50), nullable=False)
    frequency = Column(String(50), nullable=False)  # "morning", "afternoon", "night", "twice_daily", etc.
    instructions = Column(Text)
    
    # Schedule
    start_date = Column(DateTime(timezone=True), nullable=False)
    end_date = Column(DateTime(timezone=True))
    
    # Times
    morning_time = Column(String(10))  # "08:00"
    afternoon_time = Column(String(10))  # "14:00"
    night_time = Column(String(10))  # "21:00"
    
    # Status
    is_active = Column(Boolean, default=True)
    
    # Metadata
    prescribed_by = Column(String(100))
    prescription_date = Column(DateTime(timezone=True))
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    user = relationship("User", back_populates="medicines")
    logs = relationship("MedicineLog", back_populates="medicine")


class MedicineLog(Base):
    __tablename__ = "medicine_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    medicine_id = Column(Integer, ForeignKey("medicines.id"), nullable=False)
    
    # Log details
    scheduled_time = Column(DateTime(timezone=True), nullable=False)
    taken_time = Column(DateTime(timezone=True))
    status = Column(String(20), nullable=False)  # "taken", "missed", "skipped"
    
    # Additional info
    notes = Column(Text)
    side_effects = Column(Text)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    user = relationship("User", back_populates="medicine_logs")
    medicine = relationship("Medicine", back_populates="logs")