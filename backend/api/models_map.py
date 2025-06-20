from sqlalchemy import Column, Integer, String, Float
from .database_map import BaseMap 

class MapModel(BaseMap):
    __tablename__ = 'map_zones'

    primary_key = Column(Integer, primary_key=True, autoincrement=True)
    zone = Column(Integer, index=True)
    zone_name = Column(String)
    ED = Column(Float)  # Extremal Depth
    amount_of_flights = Column(Integer)