import geopandas as gpd
import geojson
import json

class MapCache:
    def __init__(self):
        self.geo_data = None
        self.geo_type = None
        self.df_geo = None
        self.zone_field = None

    def load_data(self):
        print("Loading map data...")
        with open('./db/files-airports.json') as f:
            files_details = json.load(f)

        geo_file = files_details['geo_file']
        self.geo_type = files_details['geo_type']
        self.df_geo = gpd.read_file(files_details['geo_map_file'])

        # Load GeoJSON or GPKG
        if geo_file.endswith('.gpkg'):
            geo_data_gdf = gpd.read_file(geo_file)
            self.geo_data = json.loads(geo_data_gdf.to_json())
        elif geo_file.endswith('.geojson'):
            with open(geo_file) as f:
                self.geo_data = geojson.load(f)
        else:
            raise ValueError("Unsupported file format")

        # Detect zone field
        sample_props = self.geo_data['features'][0]['properties']
        if 'LOCID' in sample_props:
            self.zone_field = 'LOCID'
        elif 'location_id' in sample_props:
            self.zone_field = 'location_id'
        else:
            raise ValueError("Geo features must contain 'location_id' or 'LOCID'.")

map_cache = MapCache()
map_cache.load_data()
