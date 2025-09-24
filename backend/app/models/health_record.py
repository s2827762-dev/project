from sqlalchemy import Column, Integer, String, DateTime, Boolean, Text, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from app.core.database import Base


class HealthRecord(Base):
    __tablename__ = "health_records"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # Record details
    consultation_date = Column(DateTime(timezone=True), nullable=False)
    doctor_name = Column(String(100), nullable=False)
    clinic_name = Column(String(200))
    
    # Consultation type
    consultation_type = Column(String(50), nullable=False)  # "general", "follow-up", "emergency", etc.
    
    # Encrypted content
    encrypted_transcript = Column(Text)  # Encrypted full transcript
    encrypted_audio_url = Column(String(500))  # Encrypted audio file path/URL
    encrypted_summary = Column(Text)  # Encrypted AI-generated summary
    
    # Prescription
    encrypted_prescription = Column(Text)  # Encrypted prescription details
    
    # Digital Safe - QR Access
    qr_access_key = Column(String(100))  # Single-use QR key for unlocking
    is_locked = Column(Boolean, default=True)
    unlock_count = Column(Integer, default=0)
    last_unlocked_at = Column(DateTime(timezone=True))
    
    # Metadata
    diagnosis = Column(Text)  # Non-encrypted basic diagnosis for search
    symptoms = Column(Text)  # Non-encrypted symptoms for analytics
    
    # File attachments
    attachments = Column(Text)  # JSON array of file paths
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    user = relationship("User", back_populates="health_records")