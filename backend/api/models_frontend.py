from sqlalchemy import Column, Integer, String, JSON, Date
from .database_frontend import BaseFrontend

class CurveFrontendModel(BaseFrontend):
    __tablename__ = 'curves_frontend'

    primary_key = Column(Integer, primary_key=True, autoincrement=True)
    id = Column(Integer, index=True)
    zone = Column(Integer, index=True)
    zone_name = Column(String)
    date = Column(Date, index=True)      
    week_day = Column(Integer)            
    data = Column(JSON)
