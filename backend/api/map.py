from fastapi import APIRouter, HTTPException
import geojson
import pandas as pd
import numpy as np
from fastapi.responses import JSONResponse
from typing import List, Dict

router = APIRouter() 

@router.post("")
async def get_map_data(plot_data: List[Dict]):  # Recebe o plot_data enviado pelo POST
    try:
        with open("./db/NYC_Taxi_Zones.geojson") as f:
            geo_data = geojson.load(f)
        
        df_geo = pd.read_csv("./db/taxi_zones.csv")

        zone_extremal_depths = {}

        for i in range(len(plot_data)):
            zone = plot_data[i]['zone']

            if zone not in zone_extremal_depths:
                zone_extremal_depths[zone] = []

            extremal_depth = plot_data[i]['extremal_depth']
            zone_extremal_depths[zone].append(extremal_depth)

        print(zone_extremal_depths)
        median_extremal_depths = {zone: np.median(extremal_depths) for zone, extremal_depths in zone_extremal_depths.items()}
        print(median_extremal_depths)


        for feature in geo_data['features']:
            zone = feature['properties']['zone']
            feature['properties']['ED'] = median_extremal_depths.get(zone, -1)
        
        return {
            "geojson": geo_data,
            "data": df_geo.to_dict(orient="records")  # Converter DataFrame para lista de dicionários
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
