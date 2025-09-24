from sqlalchemy import Column, Integer, String, DateTime, Text, ForeignKey, Float
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from app.core.database import Base


class DeviceData(Base):
    __tablename__ = "device_data"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # Device info
    device_type = Column(String(50), nullable=False)  # "bp_monitor", "glucometer", "thermometer", "pulse_oximeter"
    device_model = Column(String(100))
    device_id = Column(String(100))
    
    # Measurement data
    measurement_type = Column(String(50), nullable=False)  # "blood_pressure", "blood_sugar", "temperature", "oxygen_saturation"
    
    # Values (stored as JSON for flexibility)
    values = Column(Text, nullable=False)  # JSON: {"systolic": 120, "diastolic": 80} or {"glucose": 95, "unit": "mg/dL"}
    
    # Units and ranges
    unit = Column(String(20))
    normal_range_min = Column(Float)
    normal_range_max = Column(Float)
    
    # Status
    is_normal = Column(String(20))  # "normal", "high", "low", "critical"
    
    # Context
    measurement_context = Column(String(50))  # "fasting", "post_meal", "before_exercise", "after_exercise"
    notes = Column(Text)
    
    # Sync info
    measured_at = Column(DateTime(timezone=True), nullable=False)
    synced_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    user = relationship("User", back_populates="device_data")