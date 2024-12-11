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
  const [isLoading, setIsLoading] = useState(true);
  const [selectedZones, setSelectedZones] = useState<string[]>([]);

  const savedParameters = localStorage.getItem("savedParameters");
  const parameters = savedParameters ? JSON.parse(savedParameters) : {};

  useEffect(() => {
    console.log("ENTROU NO EFFECT DO MAPA!")
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.post("http://127.0.0.1:8000/map", parameters);
        console.log("Resposta da requisição:", response.data);
        
        // Adjust based on your actual API response structure
        if (response.data.geoData && response.data.data) {
          setGeoData(response.data.geoData);
          setZoneData(response.data.data);
          setError(null);
        } else {
          setError("Invalid data format received from server");
        }
      } catch (error) {
        console.error("Erro ao enviar os parâmetros:", error);
        setError("Failed to load map data");
      } finally {
        setIsLoading(false);
      }
    };

    // Only fetch if parameters exist
    if (Object.keys(parameters).length > 0) {
      fetchData();
    }
  }, [parameters]); // Add dependency array

  const handleSelection = (event: any) => {
    const selectedZonas = event.points.map((point: any) => point.properties.location_id);
    localStorage.setItem("selectedZones", JSON.stringify(selectedZonas));
    setSelectedZones(selectedZonas);
  };

  if (isLoading) {
    return (
      <div className="flex w-full h-full items-center justify-center">
        <div className="text-center">
          <div className="mb-4">Loading map data...</div>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  if (!geoData || !zoneData) {
    return (
      <div className="flex w-full h-full items-center justify-center">
        No data available for the map.
      </div>
    );
  }

  return (
    <Plot
      data={[
        {
          type: "choroplethmapbox",
          geojson: geoData,
          locations: geoData.features.map(
            (feature) => feature.properties.location_id 
          ),
          z: geoData.features.map((feature) => feature.properties.ED), 
          text: geoData.features.map((feature) => feature.properties.zone),
          featureidkey: "properties.location_id", 
          colorscale: "Viridis", 
          colorbar: { title: "ED", thickness: 15 }, 
        },
      ]}
      layout={{
        mapbox: {
          style: "carto-positron",
          center: { lon: -73.9845, lat: 40.695 }, // NYC center
          zoom: 9,
        },
        autosize: true,
        margin: { l: 0, r: 0, t: 0, b: 0 },
        width: "100%",
        height: "100%",
      }}
      config={{
        responsive: true,
      }}
      onSelected={handleSelection}  
    />
  );
};

export default Map;