from pydantic_settings import BaseSettings
from pydantic import Field


class Settings(BaseSettings):
    SUPABASE_URL: str = Field(..., validation_alias="SUPABASE_URL")
    SUPABASE_SERVICE_ROLE_KEY: str = Field(..., validation_alias="SUPABASE_SERVICE_ROLE_KEY")

    OWM_API_KEY: str = Field(..., validation_alias="OWM_API_KEY")
    ORS_API_KEY: str = Field(..., validation_alias="ORS_API_KEY")

    LOG_LEVEL: str = "INFO"

    class Config:
        env_file = ".env"
        extra = "ignore"


settings = Settings()
