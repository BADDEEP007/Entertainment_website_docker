from fastapi import APIRouter , Depends , HTTPException
from sqlmodel import Session , select
from db import get_sestion
from models import Game_Save
from datetime import datetime , timezone




router = APIRouter(prefix="/saves" , tags=["saves"])

@router.post("/")
def save_game(save: Game_Save , session :Session = Depends(get_sestion)):
    existing = session.exec(select(Game_Save).where(Game_Save.user_id == save.user_id).where(Game_Save.game == save.game ).where(Game_Save.slot == save.slot)).first()

    if existing:
        existing.save_data = save.save_data
        existing.saved_at = datetime.timezone.utc()
        session.add(existing)
    else:
        session.add(save)

    session.commit()
    return {"msg":"gamesaved"}


@router.get("/{user.id}/{game}")
def get_saves(user_id :int , game :str , session :Session=Depends(get_sestion)):
    saves = session.exec(
        select(Game_Save).where(Game_Save.user_id == user_id).where(Game_Save.game == game)
    ).all()

    return saves()