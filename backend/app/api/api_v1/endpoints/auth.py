from datetime import timedelta
from typing import Any
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.core import security
from app.core.config import settings
from app.core.database import get_db
from app.models.user import User
from app.schemas.auth import Token, UserLogin, UserRegister
from app.schemas.user import UserResponse

router = APIRouter()


def get_user_by_phone(db: Session, phone_number: str) -> User:
    return db.query(User).filter(User.phone_number == phone_number).first()


def create_user(db: Session, user_data: UserRegister) -> User:
    hashed_password = security.get_password_hash(user_data.password)
    db_user = User(
        phone_number=user_data.phone_number,
        name=user_data.name,
        age=user_data.age,
        gender=user_data.gender,
        village=user_data.village,
        district=user_data.district,
        state=user_data.state,
        language_preference=user_data.language_preference,
        hashed_password=hashed_password,
        emergency_contact_name=user_data.emergency_contact_name,
        emergency_contact_phone=user_data.emergency_contact_phone,
        blood_group=user_data.blood_group,
        allergies=user_data.allergies,
        chronic_conditions=user_data.chronic_conditions
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def authenticate_user(db: Session, phone_number: str, password: str) -> User:
    user = get_user_by_phone(db, phone_number)
    if not user:
        return None
    if not security.verify_password(password, user.hashed_password):
        return None
    return user


@router.post("/register", response_model=UserResponse)
def register(
    user_data: UserRegister,
    db: Session = Depends(get_db)
) -> Any:
    """
    Register a new user
    """
    # Check if user already exists
    user = get_user_by_phone(db, user_data.phone_number)
    if user:
        raise HTTPException(
            status_code=400,
            detail="Phone number already registered"
        )
    
    # Create new user
    user = create_user(db, user_data)
    return user


@router.post("/login", response_model=Token)
def login(
    user_data: UserLogin,
    db: Session = Depends(get_db)
) -> Any:
    """
    OAuth2 compatible token login, get an access token for future requests
    """
    user = authenticate_user(db, user_data.phone_number, user_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect phone number or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    elif not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Inactive user"
        )
    
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = security.create_access_token(
        user.id, expires_delta=access_token_expires
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user
    }


@router.post("/token", response_model=Token)
def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
) -> Any:
    """
    OAuth2 compatible token login, get an access token for future requests
    """
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect phone number or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = security.create_access_token(
        user.id, expires_delta=access_token_expires
    )
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user
    }