import { ChartProps } from "@/types/types";
import React, { useEffect, useState } from "react";
import Plot from "react-plotly.js";
import axios from "axios";
import { toast } from "react-toastify";

interface GeoJSON {
  type: string;
  features: Array<{
    properties: {
      zone: string;
      ED: number;
      amount_of_flights: number;
      location_id?: number;
      LOCID?: number;
    };
    geometry: {
      coordinates: [number, number];
    };
    [key: string]: any;
  }>;
}

interface ZoneData {
  LocationID: number;
  zone: string;
  [key: string]: any;
}

const Map = ({ plotData }: ChartProps) => {
  const [geoData, setGeoData] = useState<GeoJSON | null>(null);
  const [zoneData, setZoneData] = useState<ZoneData[] | null>(null);
  const [geoType, setGeoType] = useState<"Point" | "Region" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedZones, setSelectedZones] = useState<string[]>([]);
  const [zoneKey, setZoneKey] = useState<"location_id" | "LOCID">("location_id");

  const savedParameters = localStorage.getItem("savedParameters");
  const parameters = savedParameters ? JSON.parse(savedParameters) : {};
  const [hasDataFetched, setHasDataFetched] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!hasDataFetched) {
        try {
          const response = await axios.post("http://127.0.0.1:8000/map", parameters);
          const geo = response.data.geojson;

          // Detect zone identifier key
          const props = geo?.features?.[0]?.properties || {};
          if ("LOCID" in props) {
            setZoneKey("LOCID");
          } else if ("location_id" in props) {
            setZoneKey("location_id");
          } else {
            setError("GeoJSON features must contain 'location_id' or 'LOCID'");
            return;
          }

          setGeoData(geo);
          setGeoType(response.data.geo_type);
          setZoneData(response.data.data);
          setHasDataFetched(true);
        } catch (error) {
          console.error("Erro ao enviar os parâmetros:", error);
          setError("Erro ao enviar os parâmetros");
        }
      }
    };

    fetchData();
  }, [parameters, hasDataFetched]);

  // useEffect(() => {
  //   const updateEDForSelectedZones = async () => {
  //     if (selectedZones.length === 0) return;

  //     try {
  //       const newParameters = {
  //         ...parameters,
  //         zones: selectedZones,
  //         runED: true,
  //       };

  //       console.log("Parameters being sent:", newParameters);

  //     //   const response = await axios.post("http://127.0.0.1:8000/api/compute_ed", newParameters);
        
  //     //   if (response.status === 200) {
  //     //     toast.success("Computation was done successfully!");
  //     //   } else {
  //     //     toast.error("Failed to compute ED.");
  //     //   }
      
  //     //   window.location.reload(); 
  //     // } catch (err) {
  //     //   console.error("Erro ao atualizar ED:", err);
  //     //   setError("Erro ao atualizar ED");
  //     // }
  //   };

  //   updateEDForSelectedZones();
  // }, [selectedZones]);

  const handleSelection = (event: any) => {
    if (!geoData) return;

    const selectedZonas = event.points.map((point: any) => {
      const index = point.pointIndex ?? point.pointNumber;
      return geoData.features[index]?.properties?.[zoneKey];
    });

    console.log("Selected zones:", selectedZonas);
    localStorage.setItem("selectedZones", JSON.stringify(selectedZonas));
    setSelectedZones(selectedZonas);
  };

  if (error) return <div>Error: {error}</div>;

  const sizes = geoData?.features.map((f) =>
    Math.sqrt(f.properties.amount_of_flights)
  ) || [1];

  const maxSize = Math.max(...sizes);
  const desiredMaxSize = 30;
  const sizeref = (2.0 * maxSize) / (desiredMaxSize * desiredMaxSize);

  return (
    <Plot
      data={
        geoType === "Point"
          ? [
              {
                type: "scattermapbox",
                lat: geoData?.features.map((f) => f.geometry.coordinates[1]),
                lon: geoData?.features.map((f) => f.geometry.coordinates[0]),
                mode: "markers",
                marker: {
                  size: sizes,
                  sizemode: "area",
                  sizeref: sizeref,
                  sizemin: 4,
                  color: geoData?.features.map((f) => f.properties.ED),
                  colorscale: "Viridis",
                  colorbar: { title: "ED", thickness: 15 },
                  cmin: 0,
                  cmax: 1,
                  opacity: geoData?.features.map((f) =>
                    selectedZones.length === 0 || selectedZones.includes((f.properties[zoneKey] ?? "").toString())
                      ? 1
                      : 0.3
                  ),
                },
                text: geoData?.features.map(
                  (f) =>
                    `${f.properties.zone || f.properties.LOCID || f.properties.location_id}<br>ED: ${f.properties.ED?.toFixed(3)}<br>Flights: ${f.properties.amount_of_flights}`
                ),
                hoverinfo: "text",
              },
            ]
          : [
              {
                type: "choroplethmapbox",
                geojson: geoData,
                locations: geoData?.features.map(
                  (feature) => feature.properties?.[zoneKey]
                ),
                z: geoData?.features.map((feature) => feature.properties.ED),
                text: geoData?.features.map(
                  (feature) =>
                    `${feature.properties.zone || feature.properties.LOCID || feature.properties.location_id}<br>ED: ${feature.properties.ED?.toFixed(3)}`
                ),
                featureidkey: `properties.${zoneKey}`,
                colorscale: "Viridis",
                colorbar: { title: "ED", thickness: 15 },
                zmin: 0,
                zmax: 1,
                opacity: 1, 
              },
            ]
      }
      layout={{
        mapbox: {
          style: "carto-positron",
          center: { lon: -98.5795, lat: 39.8283 },
          zoom: geoType === "Point" ? 3 : 4,
        },
        autosize: true,
        margin: { l: 0, r: 0, t: 0, b: 0 },
      }}
      style={{ width: "100%", height: "100%" }}
      config={{ responsive: true }}
      onSelected={handleSelection}
    />
  );
};

export default Map;
