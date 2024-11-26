# api/map.py
from fastapi import APIRouter
import geojson
import plotly.express as px
import pandas as pd
from fastapi.responses import JSONResponse


# @router.get("")
# async def get_map():
#     try:
#         print("Iniciando a leitura do arquivo GeoJSON...")
#         # Carregar dados GeoJSON
#         with open("./db/NYC_Taxi_Zones.geojson") as f:
#             geo_data = geojson.load(f)
#         print("Arquivo GeoJSON carregado com sucesso.")

#         # Criar gráfico de mapa
#         print("Criando o gráfico...")
#         df_geo = pd.read_csv("./db/taxi_zones.csv")

#         geoFig = px.choropleth_mapbox(df_geo, geojson = geo_data, 
#                                     locations = "LocationID", 
#                                     featureidkey = "properties.location_id",
#                                     center = {"lon": -73.98445299999996, 
#                                     "lat": 40.694995999999904},
#                                     hover_name = "zone", 
#                                     mapbox_style = "carto-positron", zoom = 9)

#         geoFig.update_layout(margin=dict(l=0,r=0,b=0,t=0), paper_bgcolor = "White")
#         # Retorna o gráfico como JSON
#         response = geoFig.to_json()
#         print("JSON gerado com sucesso.")
#         return JSONResponse(content=response)

#     except Exception as e:
#         print("Erro ocorrido:", str(e))
#         return {"error": str(e)}


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
