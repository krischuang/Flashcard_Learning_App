from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker
from dotenv import load_dotenv
import os

load_dotenv()

# Build the connection URL from individual environment variables
_host     = os.getenv("DB_HOST", "localhost")
_port     = os.getenv("DB_PORT", "3306")
_name     = os.getenv("DB_NAME", "flashcard_db")
_user     = os.getenv("DB_USER")
_password = os.getenv("DB_PASSWORD")

if not _user or not _password:
    raise RuntimeError(
        "DB_USER and DB_PASSWORD must be set in your .env file. "
        "Copy .env.local to .env and start the database with: docker-compose up -d"
    )

DATABASE_URL = f"mysql+pymysql://{_user}:{_password}@{_host}:{_port}/{_name}"

engine = create_engine(DATABASE_URL, echo=False)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


class Base(DeclarativeBase):
    pass


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
