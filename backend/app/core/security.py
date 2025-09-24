from datetime import datetime, timedelta
from typing import Any, Union
from jose import jwt
from passlib.context import CryptContext
from cryptography.fernet import Fernet
import base64
import os

from app.core.config import settings

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

ALGORITHM = "HS256"


def create_access_token(
    subject: Union[str, Any], expires_delta: timedelta = None
) -> str:
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(
            minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
        )
    to_encode = {"exp": expire, "sub": str(subject)}
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)


def verify_token(token: str) -> Union[str, None]:
    try:
        payload = jwt.decode(
            token, settings.SECRET_KEY, algorithms=[ALGORITHM]
        )
        return payload.get("sub")
    except jwt.JWTError:
        return None


# Encryption for health records
def get_encryption_key() -> bytes:
    """Get or generate encryption key for health records"""
    key = settings.ENCRYPTION_KEY.encode()
    if len(key) != 32:
        # Generate a proper 32-byte key
        key = base64.urlsafe_b64encode(os.urandom(32))
    return key


def encrypt_data(data: str) -> str:
    """Encrypt sensitive health data"""
    f = Fernet(base64.urlsafe_b64encode(get_encryption_key()))
    encrypted_data = f.encrypt(data.encode())
    return base64.urlsafe_b64encode(encrypted_data).decode()


def decrypt_data(encrypted_data: str) -> str:
    """Decrypt sensitive health data"""
    f = Fernet(base64.urlsafe_b64encode(get_encryption_key()))
    decoded_data = base64.urlsafe_b64decode(encrypted_data.encode())
    decrypted_data = f.decrypt(decoded_data)
    return decrypted_data.decode()


def generate_qr_access_key() -> str:
    """Generate a single-use QR access key"""
    return base64.urlsafe_b64encode(os.urandom(32)).decode()[:32]