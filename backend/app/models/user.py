from sqlalchemy import Column, Integer, String, DateTime, Boolean, Text
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from app.core.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    phone_number = Column(String(15), unique=True, index=True, nullable=False)
    name = Column(String(100), nullable=False)
    age = Column(Integer)
    gender = Column(String(10))
    village = Column(String(100))
    district = Column(String(100))
    state = Column(String(100))
    language_preference = Column(String(10), default="en")
    
    # Authentication
    hashed_password = Column(String(255))
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    last_login = Column(DateTime(timezone=True))
    
    # Emergency contact
    emergency_contact_name = Column(String(100))
    emergency_contact_phone = Column(String(15))
    
    # Medical info
    blood_group = Column(String(5))
    allergies = Column(Text)
    chronic_conditions = Column(Text)
    
    # Relationships
    medicines = relationship("Medicine", back_populates="user")
    medicine_logs = relationship("MedicineLog", back_populates="user")
    appointments = relationship("Appointment", back_populates="user")
    health_records = relationship("HealthRecord", back_populates="user")
    symptom_logs = relationship("SymptomLog", back_populates="user")
    device_data = relationship("DeviceData", back_populates="user")
    arogya_points = relationship("ArogyaPoints", back_populates="user")