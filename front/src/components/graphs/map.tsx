import { ChartProps } from "@/types/types";
import React, { useEffect, useState } from "react";
import Plot from "react-plotly.js";
import { defaultParameters } from "../modal/modal";
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
  const parameters = savedParameters ? JSON.parse(savedParameters) : {}; // Use um objeto vazio se não houver parâmetros
  console.log("PEGOU ESSES PARAMETERS: ",parameters)

  useEffect(() => {
    console.log("ENTROU NO EFFECT DO MAPA!")
    const fetchData = async () => {
      try {
        const response = await axios.post("http://127.0.0.1:8000/map", parameters);
        console.log("Resposta da requisição:", response.data);
        
        setGeoData(response.data.geoData);
        setZoneData(response.data.data);

      } catch (error) {
        console.error("Erro ao enviar os parâmetros:", error);
      }
    };

    fetchData(); // Chama a função fetchData para executar a requisição.
  }, [parameters]);


  const handleSelection = (event: any) => {
    const selectedZonas = event.points.map((point: any) => point.properties.location_id);
    // console.log("Zonas selecionadas:", selectedZonas);
    localStorage.setItem("selectedZones", JSON.stringify(selectedZonas));
    setSelectedZones(selectedZonas);
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!geoData || !zoneData) {
    return <div className="flex w-full h-full items-center justify-center">
      Please wait a moment while the map is loading...
    </div>;
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