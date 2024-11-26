# api/map.py
from fastapi import APIRouter
import geojson
import plotly.express as px
import pandas as pd
from fastapi.responses import JSONResponse

router = APIRouter()

@router.get("")
async def get_map_data():
    try:
        # Carregar GeoJSON
        with open("./db/NYC_Taxi_Zones.geojson") as f:
            geo_data = geojson.load(f)
        
        # Carregar CSV
        df_geo = pd.read_csv("./db/taxi_zones.csv")
        
        # Retornar dados estruturados
        return {
            "geojson": geo_data,
            "data": df_geo.to_dict(orient="records")  # Converter DataFrame para lista de dicionários
        }
    except Exception as e:
        return {"error": str(e)}
