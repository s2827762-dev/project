from typing import List, Union
from pydantic import AnyHttpUrl, field_validator
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = "healthaxis-secret-key-change-in-production"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 8  # 8 days
    
    # Database
    DATABASE_URL: str = "sqlite:///./healthaxis.db"
    
    # CORS
    BACKEND_CORS_ORIGINS: List[AnyHttpUrl] = [
        "http://localhost:3000",
        "http://localhost:12000",
        "http://localhost:12001",
        "https://work-1-isuyteossihjpgfx.prod-runtime.all-hands.dev",
        "https://work-2-isuyteossihjpgfx.prod-runtime.all-hands.dev"
    ]
    
    # Trusted hosts
    ALLOWED_HOSTS: List[str] = [
        "localhost",
        "127.0.0.1",
        "0.0.0.0",
        "work-1-isuyteossihjpgfx.prod-runtime.all-hands.dev",
        "work-2-isuyteossihjpgfx.prod-runtime.all-hands.dev"
    ]

    @field_validator("BACKEND_CORS_ORIGINS", mode="before")
    def assemble_cors_origins(cls, v: Union[str, List[str]]) -> Union[List[str], str]:
        if isinstance(v, str) and not v.startswith("["):
            return [i.strip() for i in v.split(",")]
        elif isinstance(v, (list, str)):
            return v
        raise ValueError(v)

    # Google API
    GOOGLE_CLIENT_ID: str = ""
    GOOGLE_CLIENT_SECRET: str = ""
    GOOGLE_REDIRECT_URI: str = ""
    
    # Encryption
    ENCRYPTION_KEY: str = "your-32-byte-encryption-key-here!!"
    
    # AI/ML
    OPENAI_API_KEY: str = ""
    
    class Config:
        env_file = ".env"


settings = Settings()