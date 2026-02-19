from sqlmodel import create_engine , Session , SQLModel , select
from dotenv import load_dotenv



import os

load_dotenv()


Database_url = os.getenv("DATABASE_URL")
print(Database_url)
engine = create_engine(Database_url, echo = True)

def init_db():
    SQLModel.metadata.create_all(engine)


def get_sestion():
    with Session(engine) as session:
        yield session

def create_table():
    SQLModel.metadata.create_all(engine)

