"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const Map = dynamic(() => import("./graphs/map"), { ssr: false });
const LineChart = dynamic(() => import("./graphs/lineChart"), { ssr: false });
const ParallelCoordinatesChart = dynamic(() => import("./graphs/parallelCord"), { ssr: false });

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
    <div className="flex flex-col w-full h-full bg-gray-100 ">
      <div className="flex p-2 justify-evenly h-2/6">
        <div className="w-1/2">
          <Map plotData={plotData} />
        </div>
        <div className="w-1/2">
          <LineChart plotData={plotData} />
        </div>
      </div>

      <div className="flex justify-evenly">
        <div className="bg-white shadow-md rounded">
          <ParallelCoordinatesChart plotData={plotData} />
        </div>
        <div className="bg-white shadow-md rounded">Grafico 4</div>
        <div className="bg-white shadow-md rounded">Grafico 5</div>
      </div>
    </div>
  );
}
