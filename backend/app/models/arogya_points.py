from sqlalchemy import Column, Integer, String, DateTime, Text, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from app.core.database import Base


class ArogyaPoints(Base):
    __tablename__ = "arogya_points"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # Points details
    points = Column(Integer, nullable=False)
    activity_type = Column(String(50), nullable=False)  # "medicine_taken", "appointment_attended", "symptom_logged", etc.
    activity_description = Column(Text)
    
    # Reference to related record
    reference_type = Column(String(50))  # "medicine_log", "appointment", "symptom_log", etc.
    reference_id = Column(Integer)
    
    # Multipliers and bonuses
    base_points = Column(Integer, nullable=False)
    multiplier = Column(Integer, default=1)
    bonus_points = Column(Integer, default=0)
    bonus_reason = Column(String(100))
    
    # Timestamps
    earned_at = Column(DateTime(timezone=True), server_default=func.now())
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    user = relationship("User", back_populates="arogya_points")