from pydantic_settings import BaseSettings
from functools import lru_cache

class Settings(BaseSettings):
    PROJECT_NAME: str = "EduShield AI Service"
    API_V1_STR: str = "/api/v1"
    API_KEY: str = "dummy_key"
    MODEL_PATH: str = "model_artifacts/random_forest_model.pkl"
    SCALER_PATH: str = "model_artifacts/feature_scaler.pkl"
    ENVIRONMENT: str = "development"

    class Config:
        env_file = ".env"

@lru_cache()
def get_settings():
    return Settings()

settings = get_settings()
