from fastapi import APIRouter , Depends, HTTPException
from sqlmodel import Session , select
from db import get_sestion
from models import GameScore
from datetime import datetime

router = APIRouter(prefix="/saves" , tags=["saves"])
@router.post("/")
def save_score(score :GameScore , session : Session = Depends(get_sestion)):

    existing = session.exec(
        select(GameScore).where(GameScore.user_id == score.user_id).where(GameScore.game == score.game)

    ).first()

    if existing:
        existing.score = score.score
        existing.playtime = score.playtime
        existing.last_played = score.last_played
        session.add(existing)
    else:
        session.add(score)

    session.commit()
    return {"mssg":"score saved"}


@router.get("/{user_id}")
def get_Score(user_id : int , session: Session = Depends(get_sestion)):
    scores = session.exec(
        select(GameScore).where(GameScore.user_id == user_id)

    ).all()
    return  scores