from sqlalchemy import Column, Integer, String, DateTime, Text, ForeignKey, Float
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from app.core.database import Base


class SymptomLog(Base):
    __tablename__ = "symptom_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # Symptom details
    symptom_type = Column(String(100), nullable=False)  # "headache", "fever", "cough", etc.
    severity = Column(Integer, nullable=False)  # 1-10 scale
    description = Column(Text)
    
    # Location (if applicable)
    body_part = Column(String(100))
    
    # Duration
    started_at = Column(DateTime(timezone=True))
    ended_at = Column(DateTime(timezone=True))
    
    # Associated factors
    triggers = Column(Text)  # JSON array of potential triggers
    medications_taken = Column(Text)  # JSON array of medications
    
    # Mood and activity
    mood_rating = Column(Integer)  # 1-10 scale
    activity_level = Column(String(20))  # "low", "moderate", "high"
    
    # Environmental factors
    weather_condition = Column(String(50))
    location = Column(String(100))
    
    # Timestamps
    logged_at = Column(DateTime(timezone=True), server_default=func.now())
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    user = relationship("User", back_populates="symptom_logs")