from sqlmodel import create_engine, Session, SQLModel
from app.models.url import URL
from app.utils.utils import encode_base62

sqlite_file_name = "database.db"
sqlite_url = f"sqlite:///{sqlite_file_name}"
engine = create_engine(sqlite_url, echo=True)


def create_db_and_tables():
    SQLModel.metadata.create_all(engine)


def get_session():
    with Session(engine) as session:
        return session 

if __name__ == "__main__":
    create_db_and_tables()
    session = get_session()
    
    new_url_entry = URL(long_url="https://www.google.com")

    encoded_url = encode_base62(new_url_entry.id)

    new_url_entry.short_code = encoded_url

    session.add(new_url_entry)
    session.commit()

    print(f"Short URL: http://localhost:8000/shorten/{encoded_url}")