from fastapi import APIRouter, HTTPException
import geojson
import pandas as pd
import numpy as np
from fastapi.responses import JSONResponse
from typing import List, Dict

router = APIRouter()

def calculate_extremal_depth(values: List[float], prices: List[float], distances: List[float], total_time: List[float]) -> float:
    # Implementação simplificada de extremal depth
    # Aqui você pode usar uma abordagem própria de cálculo de extremal depth
    # Por exemplo, calculando a distância média ou outro critério
    # Neste caso, estamos usando a média simples para simplificar
    # A extremal depth real pode ser mais complexa, dependendo de como você define
    return np.median(values)  # Substitua por seu cálculo de extremal depth real

@router.post("")
async def get_map_data(plot_data: List[Dict]):  # Recebe o plot_data enviado pelo POST
    try:
        # Carregar GeoJSON
        with open("./db/NYC_Taxi_Zones.geojson") as f:
            geo_data = geojson.load(f)
        
        # Carregar CSV
        df_geo = pd.read_csv("./db/taxi_zones.csv")
        
        # Calcular a extremal depth média para cada zona
        median_extremal_depths = {}
        for zone_data in plot_data:
            zone = zone_data['zone']
            values = zone_data['data']['values']
            prices = zone_data['data']['prices']
            distances = zone_data['data']['distances']
            total_time = zone_data['data']['total_time']
            
            # Calcular a extremal depth para essa zona
            ED = calculate_extremal_depth(values, prices, distances, total_time)
            
            # Armazenar a extremal depth para essa zona
            median_extremal_depths[zone] = ED
        
        # Adicionar a extremal depth ao geo_data
        for feature in geo_data['features']:
            zone = feature['properties']['zone']
            # Adicionar a extremal depth (ou -1 se não houver dados)
            feature['properties']['ED'] = median_extremal_depths.get(zone, -1)
        
        # Retornar os dados processados
        return {
            "geojson": geo_data,
            "data": df_geo.to_dict(orient="records")  # Converter DataFrame para lista de dicionários
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
