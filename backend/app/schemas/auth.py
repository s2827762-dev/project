from typing import Optional
from pydantic import BaseModel, Field
from app.schemas.user import UserResponse


class UserLogin(BaseModel):
    phone_number: str = Field(..., min_length=10, max_length=15)
    password: str = Field(..., min_length=6)


class UserRegister(BaseModel):
    phone_number: str = Field(..., min_length=10, max_length=15)
    password: str = Field(..., min_length=6)
    name: str = Field(..., min_length=2, max_length=100)
    age: Optional[int] = Field(None, ge=1, le=120)
    gender: Optional[str] = Field(None, pattern="^(male|female|other)$")
    village: Optional[str] = Field(None, max_length=100)
    district: Optional[str] = Field(None, max_length=100)
    state: Optional[str] = Field(None, max_length=100)
    language_preference: str = Field("en", pattern="^(en|hi|ta|te)$")
    
    # Emergency contact
    emergency_contact_name: Optional[str] = Field(None, max_length=100)
    emergency_contact_phone: Optional[str] = Field(None, max_length=15)
    
    # Medical info
    blood_group: Optional[str] = Field(None, max_length=5)
    allergies: Optional[str] = None
    chronic_conditions: Optional[str] = None


class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse