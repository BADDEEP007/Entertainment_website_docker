from sqlmodel import SQLModel , Field , Relationship

from typing import Optional , List
from datetime import datetime , timezone

def get_utc_now():
    return datetime.now(timezone.utc)


class User(SQLModel , table = True):
    id: Optional[int] = Field(default=None , primary_key = True)
    name : str 
    email :str


    Game_Save : List["Game_Save"] =  Relationship(back_populates="user")
    Scores : List["GameScore"] =  Relationship(back_populates="user")



class Game_Save(SQLModel , table=True, ):
    id : Optional[int] = Field(default=None , primary_key=True)
    user_id : int = Field(foreign_key="user.id")
    game:str
    slot : int = Field(default=1)
    save_data : bytes
    saved_at : datetime = Field(default_factory= get_utc_now )

    user:Optional[User] = Relationship(back_populates="Game_Save")

class GameScore(SQLModel , table=True):
    id : Optional[int] = Field(default=None , primary_key=True)
    user_id: int = Field(foreign_key="user.id")
    game:str
    score : int = Field(default=0)
    playtime: int= Field(default=0)
    last_played: datetime = Field(default_factory=get_utc_now)

    user : Optional[User]  = Relationship(back_populates="Scores")

