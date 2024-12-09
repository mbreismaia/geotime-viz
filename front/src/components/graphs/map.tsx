import { ChartProps } from "@/types/types";
import React, { useEffect, useState } from "react";
import Plot from "react-plotly.js";

interface GeoJSON {
  type: string;
  features: Array<{
    properties: {
      zone: string;
      ED: number; // Median extremal depth
      location_id?: number; // Optional: for feature ID reference
    };
    [key: string]: any; // Allow additional fields in features
  }>;
}

interface TaxiZoneData {
  LocationID: number; // Corresponds to `location_id` in GeoJSON
  zone: string;
  [key: string]: any; // Allow additional fields from CSV data
}

const Map = ({ plotData }: ChartProps) => {
  const [geoData, setGeoData] = useState<GeoJSON | null>(null);
  const [zoneData, setZoneData] = useState<TaxiZoneData[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:8000/map", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(plotData), // Send plotData in request body
        });

        if (!response.ok) {
          throw new Error(`Error fetching data: ${response.statusText}`);
        }

        const { geojson, data } = await response.json();
        setGeoData(geojson);
        setZoneData(data);
      } catch (err) {
        setError((err as Error).message);
      }
    };

    fetchData();
  }, [plotData]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!geoData || !zoneData) {
    return <div>Loading map...</div>;
  }

  return (
    <Plot
      className="shadow-md rounded-lg"
      data={[
        {
          type: "choroplethmapbox",
          geojson: geoData,
          locations: geoData.features.map(
            (feature) => feature.properties.location_id // Match with feature ID
          ),
          z: geoData.features.map((feature) => feature.properties.ED), // Median ED values
          text: geoData.features.map((feature) => feature.properties.zone), // Zone names
          featureidkey: "properties.location_id", // ID reference in GeoJSON
          colorscale: "Viridis", // Color scale
          colorbar: { title: "Extremal Depth", thickness: 15 }, // Color legend
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
        width: 800,
        height: 600,
      }}
      config={{
        responsive: true,
      }}
    />
  );
};

export default Map;
