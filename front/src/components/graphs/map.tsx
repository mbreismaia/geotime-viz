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

const Map: React.FC = () => {
  const [geoData, setGeoData] = useState<GeoJSON | null>(null);
  const [zoneData, setZoneData] = useState<TaxiZoneData[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:8000/map");
        console.log('RESPOSTA: ',response)
        if (!response.ok) {
          throw new Error(`Erro ao buscar dados: ${response.statusText}`);
        }
        const { geojson, data } = await response.json();
        console.log('AQUI ELES:',geojson, data)
        setGeoData(geojson);
        setZoneData(data);
      } catch (err) {
        setError((err as Error).message);
      }
    };

    fetchData();
  }, []);

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
          z: zoneData.map((d) => d.LocationID), // Substituir por uma métrica relevante
          text: zoneData.map((d) => d.zone),
          featureidkey: "properties.location_id",
          colorscale: "Viridis",
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

