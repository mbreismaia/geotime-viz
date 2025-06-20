from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Caminho do novo banco de dados para o mapa
MAP_DATABASE_URL = "sqlite:///./db/map_data.db"

engine_map = create_engine(MAP_DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocalMap = sessionmaker(autocommit=False, autoflush=False, bind=engine_map)
BaseMap = declarative_base()
