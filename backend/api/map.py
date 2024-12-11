from fastapi import APIRouter, HTTPException
import geojson
import json
import pandas as pd
import numpy as np
from fastapi.responses import JSONResponse
from typing import List, Dict
from service.impl.plots_service import PlotService
from schemas.parameters import Parameters
from functools import lru_cache

router = APIRouter()

# Cache the geojson and taxi zones data
@lru_cache()
def load_static_data():
    with open("./db/NYC_Taxi_Zones.geojson") as f:
        geo_data = geojson.load(f)
    df_geo = pd.read_csv("./db/taxi_zones.csv")
    return geo_data, df_geo

@router.post("")
async def get_map_data(parameters: Parameters):
    try:
        # Load cached static data
        geo_data, df_geo = load_static_data()
        
        # Get plot data
        PlotService.get_plot_data_zone(parameters)

        zone_ed = {}
        zone_ed_set = set()

        # Load and process zone data
        with open('./db/database_zone.json') as json_file:
            curve_data = json.load(json_file)
            for curve in curve_data["curves"]:
                zone = curve["zone"]
                ed = curve["extremal_depth"]
                zone_ed[str(zone)] = ed
                zone_ed_set.add(str(zone))

        # Update features with ED values
        for feature in geo_data['features']:
            cur_zone = str(feature['properties']['location_id'])
            feature['properties']['ED'] = zone_ed.get(cur_zone, 0)

        return {
            "geojson": geo_data,
            "data": df_geo.to_dict(orient="records")
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))