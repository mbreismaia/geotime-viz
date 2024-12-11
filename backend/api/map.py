from fastapi import APIRouter, HTTPException
import geojson
import json
import pandas as pd
import numpy as np
from fastapi.responses import JSONResponse
from typing import List, Dict
from service.impl.plots_service import PlotService
from schemas.parameters import Parameters

router = APIRouter() 

@router.post("")
async def get_map_data(plot_data: List[Dict]): 
    hour_interval = (0, 23)
    date_interval = ("2012-01-01", "2012-12-31")
    param = Parameters(hour_interval=hour_interval, date_interval=date_interval)

    PlotService.get_plot_data_zone(param)
    
    try:
        with open("./db/NYC_Taxi_Zones.geojson") as f:
            geo_data = geojson.load(f)
        
        df_geo = pd.read_csv("./db/taxi_zones.csv")

        zone_ed = {}
        zone_ed_set = set()

        with open('./db/database_zone.json') as json_file:
            curve_data = json.load(json_file)
            for curve in curve_data["curves"]:
                zone = curve["zone"]
                ed = curve["extremal_depth"]
                zone_ed[str(zone)] = ed
                zone_ed_set.add(str(zone))

        for feature in geo_data['features']:
            cur_zone = str(feature['properties']['location_id'])
            
            if cur_zone in zone_ed_set:
                feature['properties']['ED'] = zone_ed[cur_zone]
            else:
                feature['properties']['ED'] = 0
        
        return {
            "geojson": geo_data,
            "data": df_geo.to_dict(orient="records") 
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))