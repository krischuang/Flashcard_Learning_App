from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from ..database import get_db
from ..models import Flashcard
from ..schemas import FlashcardCreate, FlashcardUpdate, FlashcardOut

router = APIRouter(prefix="/cards", tags=["flashcards"])


@router.get("/", response_model=List[FlashcardOut])
def list_cards(db: Session = Depends(get_db)):
    return db.query(Flashcard).order_by(Flashcard.created_at.asc()).all()


@router.post("/", response_model=FlashcardOut, status_code=status.HTTP_201_CREATED)
def create_card(payload: FlashcardCreate, db: Session = Depends(get_db)):
    card = Flashcard(**payload.model_dump())
    db.add(card)
    db.commit()
    db.refresh(card)
    return card


@router.put("/{card_id}", response_model=FlashcardOut)
def update_card(card_id: int, payload: FlashcardUpdate, db: Session = Depends(get_db)):
    card = db.get(Flashcard, card_id)
    if not card:
        raise HTTPException(status_code=404, detail="Card not found")
    for field, value in payload.model_dump(exclude_none=True).items():
        setattr(card, field, value)
    db.commit()
    db.refresh(card)
    return card


@router.delete("/{card_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_card(card_id: int, db: Session = Depends(get_db)):
    card = db.get(Flashcard, card_id)
    if not card:
        raise HTTPException(status_code=404, detail="Card not found")
    db.delete(card)
    db.commit()
