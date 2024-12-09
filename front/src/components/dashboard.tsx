"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const Map = dynamic(() => import("./graphs/map"), { ssr: false });
const LineChart = dynamic(() => import("./graphs/lineChart"), { ssr: false });
const ParallelCoordinatesChart = dynamic(() => import("./graphs/parallelCord"), { ssr: false });
const ScatterChart = dynamic(() => import("./graphs/scatterChart"), { ssr: false });

export default function Dashboard() {
  const [plotData, setPlotData] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedPlotData = localStorage.getItem("plotData");
      if (savedPlotData) {
        const parsedData = JSON.parse(savedPlotData);
        console.log("Dados parseados do localStorage:", parsedData);
        setPlotData(parsedData.data);
      } else {
        console.log("Nenhum dado encontrado no localStorage.");
      }
    }
  }, []);

  if (typeof window === "undefined" || !plotData) {
    return <div>Loading data...</div>;
  }

  return (
    <div className="flex flex-col w-full h-full bg-gray-100 p-4 gap-4">
      {/* Primeira linha de gráficos */}
      <div className="flex flex-wrap justify-between gap-4">
        <div className="w-[48%] aspect-video bg-white shadow-md rounded">
          <Map plotData={plotData} />
        </div>
        <div className="w-[48%] aspect-video bg-white shadow-md rounded">
          <LineChart plotData={plotData} />
        </div>
      </div>

      {/* Segunda linha de gráficos */}
      <div className="flex flex-wrap justify-between gap-4">
        <div className="w-[48%] aspect-video bg-white shadow-md rounded">
          <ParallelCoordinatesChart plotData={plotData} />
        </div>
        <div className="w-[48%] aspect-video bg-white shadow-md rounded">
          <ScatterChart plotData={plotData} />
        </div>
      </div>
    </div>
  );
}
