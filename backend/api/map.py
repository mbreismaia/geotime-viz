from fastapi import APIRouter, HTTPException
from service.map_cache import map_cache
from service.plots_service import PlotService
from api.database_map import SessionLocalMap
from schemas.parameters import Parameters
from pydantic import BaseModel
from typing import List


router = APIRouter()

@router.post("")
async def get_map_data(parameters: Parameters): 
    try:
        # Read DB
        with SessionLocalMap() as db:
            df = PlotService.read_data_from_map_db(db)

        zones_db = df['zone_name'].unique().tolist()

        # Copia os dados do cache
        geo_data = {
            "type": map_cache.geo_data["type"],
            "features": []
        }

        for feature in map_cache.geo_data["features"]:
            cur_zone = str(feature['properties'][map_cache.zone_field])
            if cur_zone in zones_db:
                new_feature = feature.copy()

                match = df.loc[df['zone_name'] == cur_zone]
                if not match.empty:
                    new_feature['properties']['ED'] = float(match['ED'].values[0])
                    new_feature['properties']['amount_of_flights'] = int(match['amount_of_flights'].values[0])

                geo_data["features"].append(new_feature)

        return {
            "geojson": geo_data,
            "data": map_cache.df_geo.__geo_interface__,
            "geo_type": map_cache.geo_type
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))