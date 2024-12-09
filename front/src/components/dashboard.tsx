"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const Map = dynamic(() => import("./graphs/map"), { ssr: false });
const LineChart = dynamic(() => import("./graphs/lineChart"), { ssr: false });
const ParallelCoordinatesChart = dynamic(() => import("./graphs/parallelCord"), { ssr: false });
const ScatterChart = dynamic(() => import("./graphs/scatterChart"), { ssr: false });
const ViolinPlot = dynamic(() => import("./graphs/viollin"), { ssr: false });

interface DashboardProps {
  selectedChart: string;
}

export default function Dashboard({ selectedChart }: DashboardProps) {
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

  const isSingleChart = [
    "map", "viollin", "parallel", "lineChart", "scatter"
  ].includes(selectedChart);

  const isDashboard = selectedChart === "dashboard";

  return (
    <div className="flex flex-col w-full h-full bg-gray-100 p-4 gap-4">
      {/* Primeira linha de gráficos */}
      <div className="flex flex-wrap justify-between gap-4">
        {(selectedChart === "map" || isDashboard) && (
          <div className={`bg-white shadow-md rounded ${isSingleChart || isDashboard ? "w-full h-full" : "w-[48%] aspect-video"}`}>
            <Map plotData={plotData} />
          </div>
        )}
        {(selectedChart === "viollin" || isDashboard) && (
          <div className={`bg-white shadow-md rounded ${isSingleChart || isDashboard ? "w-full h-full" : "w-[48%] aspect-video"}`}>
            <ViolinPlot plotData={plotData} />
          </div>
        )}
      </div>

      {/* Segunda linha de gráficos */}
      <div className="flex flex-wrap justify-between gap-4">
        {(selectedChart === "parallel" || isDashboard) && (
          <div className={`bg-white shadow-md rounded ${isSingleChart || isDashboard ? "w-full h-full" : "w-[30%] aspect-video"}`}>
            <ParallelCoordinatesChart plotData={plotData} />
          </div>
        )}
        {(selectedChart === "lineChart" || isDashboard) && (
          <div className={`bg-white shadow-md rounded ${isSingleChart || isDashboard ? "w-full h-full" : "w-[30%] aspect-video"}`}>
            <LineChart plotData={plotData} />
          </div>
        )}
        {(selectedChart === "scatter" || isDashboard) && (
          <div className={`bg-white shadow-md rounded ${isSingleChart || isDashboard ? "w-full h-full" : "w-[30%] aspect-video"}`}>
            <ScatterChart plotData={plotData} />
          </div>
        )}
      </div>
    </div>
  );
}
