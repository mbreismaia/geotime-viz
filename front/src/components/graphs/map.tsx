import { ChartProps } from "@/types/types";
import React, { useEffect, useState } from "react";
import Plot from "react-plotly.js";
import axios from "axios";


interface GeoJSON {
  type: string;
  features: Array<{
    properties: {
      zone: string;
      ED: number;
      location_id?: number; 
    };
    [key: string]: any; 
  }>;
}

interface TaxiZoneData {
  LocationID: number; 
  zone: string;
  [key: string]: any;
}

const Map = ({ plotData }: ChartProps) => {
  const [geoData, setGeoData] = useState<GeoJSON | null>(null);
  const [zoneData, setZoneData] = useState<TaxiZoneData[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedZones, setSelectedZones] = useState<string[]>([]);

  const savedParameters = localStorage.getItem("savedParameters");
  const parameters = savedParameters ? JSON.parse(savedParameters) : {}; 
  const [hasDataFetched, setHasDataFetched] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!hasDataFetched) { 
        try {
          const response = await axios.post("http://127.0.0.1:8000/map", parameters);
          console.log("Resposta do servidor:", response.data);
          setGeoData(response.data.geojson); 
          setZoneData(response.data.data);
          setHasDataFetched(true); 
        } catch (error) {
          console.error("Erro ao enviar os parâmetros:", error);
        }
      }
    };

    fetchData();
  }, [parameters, hasDataFetched]);


  const handleSelection = (event: any) => {
    const selectedZonas = event.points.map((point: any) => point.properties.location_id);
    localStorage.setItem("selectedZones", JSON.stringify(selectedZonas));
    setSelectedZones(selectedZonas);
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <Plot
      data={[
        {
          type: "choroplethmapbox",
          geojson: geoData,
          locations: geoData?.features.map(
            (feature) => feature.properties.location_id 
          ),
          z: geoData?.features.map((feature) => feature.properties.ED), 
          text: geoData?.features.map((feature) => feature.properties.zone),
          featureidkey: "properties.location_id", 
          colorscale: "Viridis", 
          colorbar: { title: "ED", thickness: 15 }, 
        },
      ]}
      layout={{
        mapbox: {
          style: "carto-positron",
          center: { lon: -73.9845, lat: 40.695 }, 
          zoom: 9,
        },
        autosize: true,
        margin: { l: 0, r: 0, t: 0, b: 0 },
        width: 600,
        height: 500,
      }}
      config={{
        responsive: true,
      }}
      onSelected={handleSelection}  
    />
  );
};

export default Map;