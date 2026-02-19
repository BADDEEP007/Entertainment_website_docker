from fastapi import APIRouter , Depends, HTTPException
from sqlmodel import Session , select
from db import get_sestion
from models import User


router = APIRouter(prefix="/users",tags=["users"])


@router.post("/")
def create_user(user:User , session :Session = Depends(get_sestion)):
    session.add(user)
    session.commit()
    session.refresh(user)
    return user

@router.get("/")
def get_users(session : Session = Depends(get_sestion)):
    users= session.exec(select(User).all())
    return users


@router.get("/{user_id}")
def get_user (user_id :int ,session :Session = Depends(get_sestion)):
    user =session.get(User , user_id)
    if not user:
        raise HTTPException(status_code=404 , detail = "user not found")
    return user 



@router.put("/{user_id}")
def update_user (user_id :int , updated: User , Session= Depends(get_sestion)):
    user = Session.get(User , user_id)
    if not user:
        raise HTTPException(status_code=404 , detail="user not found")
    
    user.name = updated.name
    user.email = updated.email
    Session.add(user)
    Session.commit()
    Session.refresh(user)
    return user


@router.delete("/{user_id}")
def delete_user(user_id:int , session : Session = Depends(get_sestion)):
    user = session.get(User , user_id)
    if not user: raise HTTPException(status_code=404 , detail="user not found")
    session.delete(user)
    session.commit()
    return{"mssg":"user is deleted"}