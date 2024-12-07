import { ChartProps } from "@/types/types";
import React, { useEffect, useState } from "react";
import Plot from "react-plotly.js";

interface GeoJSON {
  type: string;
  features: any[];
}

interface TaxiZoneData {
  LocationID: number;
  zone: string;
  [key: string]: any; // Permite campos adicionais
}

const Map = ({ plotData }: ChartProps) => {
  const [geoData, setGeoData] = useState<GeoJSON | null>(null);
  const [zoneData, setZoneData] = useState<TaxiZoneData[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Enviar os dados para o endpoint
        const response = await fetch("http://localhost:8000/map", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(plotData),  // Enviar plotData no corpo da requisição
        });

        if (!response.ok) {
          throw new Error(`Erro ao enviar dados: ${response.statusText}`);
        }

        const { geojson, data } = await response.json();
        setGeoData(geojson);
        setZoneData(data);
      } catch (err) {
        setError((err as Error).message);
      }
    };

    fetchData();
  }, [plotData]);  // Adicionar plotData como dependência

  if (error) {
    return <div>Erro: {error}</div>;
  }

  if (!geoData || !zoneData) {
    return <div>Carregando mapa...</div>;
  }

  return (
   <Plot
      className="shadow-md rounded-lg"
      data={[
        {
          type: "choroplethmapbox",
          geojson: geoData,
          locations: zoneData.map((d) => d.LocationID),
          z: zoneData.map((d) => d.ED), // Usando a extremal depth
          text: zoneData.map((d) => d.zone),
          featureidkey: "properties.location_id",
          colorscale: "Viridis", // Escolha uma escala apropriada
          colorbar: { title: "Extremal Depth", thickness: 10 }, // Adiciona a legenda de cores
        },
      ]}
      layout={{
        mapbox: {
          style: "carto-positron",
          center: { lon: -73.98445299999996, lat: 40.694995999999904 },
          zoom: 9,
        },
        margin: { l: 0, r: 0, t: 0, b: 0 },
        width: 600,
        height: 300
      }}
    />
  );
};

export default Map;
