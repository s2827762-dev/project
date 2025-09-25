from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base
from datetime import datetime

class Reminder(Base):
    __tablename__ = "reminders"
    
    id = Column(Integer, primary_key=True, index=True)
    medicine_id = Column(Integer, ForeignKey("medicines.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # Reminder details
    time = Column(String(5), nullable=False)  # HH:MM format
    frequency = Column(String(20), nullable=False)  # morning, afternoon, night
    enabled = Column(Boolean, default=True)
    sound = Column(Boolean, default=True)
    snooze_minutes = Column(Integer, default=10)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    medicine = relationship("Medicine", back_populates="reminders")
    user = relationship("User", back_populates="reminders")
    
    def to_dict(self):
        return {
            "id": str(self.id),
            "medicine_id": str(self.medicine_id),
            "user_id": str(self.user_id),
            "time": self.time,
            "frequency": self.frequency,
            "enabled": self.enabled,
            "sound": self.sound,
            "snooze_minutes": self.snooze_minutes,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None
        }