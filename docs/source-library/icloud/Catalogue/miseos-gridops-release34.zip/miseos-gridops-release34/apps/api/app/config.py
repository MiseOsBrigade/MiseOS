from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    database_url: str = "postgresql+psycopg://miseos:miseos@localhost:5432/miseos"
    nats_url: str = "nats://localhost:4222"
    canonical_data_path: str = "/app/data/miseos-ecosystem-135.json"
    workflow_path: str = "/app/workflows/operations.service-recovery.v1.json"
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

settings = Settings()
