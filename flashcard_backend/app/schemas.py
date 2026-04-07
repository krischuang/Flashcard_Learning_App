from datetime import datetime
from pydantic import BaseModel, Field


class FlashcardCreate(BaseModel):
    question: str = Field(..., min_length=1)
    answer: str = Field(..., min_length=1)
    category: str = Field(default="General")


class FlashcardUpdate(BaseModel):
    question: str | None = Field(default=None, min_length=1)
    answer: str | None = Field(default=None, min_length=1)
    category: str | None = Field(default=None, min_length=1)


class FlashcardOut(BaseModel):
    id: int
    question: str
    answer: str
    category: str
    created_at: datetime

    model_config = {"from_attributes": True}
