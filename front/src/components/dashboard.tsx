"use client";
import { useEffect, useState } from "react";
import { ChartProps } from "@/types/types";
import dynamic from "next/dynamic";

const Map = dynamic(() => import("./graphs/map"), { ssr: false });
const LineChart = dynamic(() => import("./graphs/lineChart"), { ssr: false });
const ParallelCoordinatesChart = dynamic(() => import("./graphs/parallelCord"), { ssr: false });
const ViolinPlot = dynamic(() => import("./graphs/viollin"), { ssr: false });
const ScatterChart = dynamic(() => import("./graphs/scatterChart"), { ssr: false });


export default function Dashboard() {
  const [plotData, setPlotData] = useState<ChartProps["plotData"]>(null); 
  const [selectedPoints, setSelectedPoints] = useState<any[]>([]);
  const [highlightedID, setHighlightedID] = useState<string | null>(null); 


  const handlePointsSelected = (points: any[]) => {
    setSelectedPoints(points);
  };

  const handleHover = (id: string) => {
    console.log("ID destacado:", id);
    setHighlightedID(id);
  };

  useEffect(() => {
    const savedPlotData = localStorage.getItem("plotData");

    if (savedPlotData) {
      const parsedData = JSON.parse(savedPlotData);
      console.log("Dados parseados do localStorage:", parsedData);
      setPlotData(parsedData.data); 
    } else {
      console.log("Nenhum dado encontrado no localStorage.");
    }
  }, []); 

  // Tela de Carregando os dados
  if (!plotData) {
    return <div className="w-full bg-gray-100 flex items-center justify-center">
      <div className="flex flex-col text-center items-center gap-y-4">
        <div className="w-16 h-16 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
        <p className="text-lg text-gray-700">Loading data and visualizations...</p>
      </div>
    </div>;
  }

  return (
     <div className="flex flex-col w-full h-full bg-gray-100 p-4 gap-y-4 overflow-hidden">
        <div className="flex w-full h-108 gap-x-4">
          <div className="w-1/2 overflow-hidden shadow-md rounded bg-white">
            < Map plotData={plotData} />
          </div>
          <div className="w-1/2 p-2 overflow-hidden shadow-md rounded bg-white">
            <ViolinPlot plotData={plotData} selectedPoints={selectedPoints} onHover={handleHover} />
          </div>
        </div>

        <div className="flex w-full h-96 gap-x-4">
          <div className="w-2/6 bg-white shadow-md rounded">
            <ParallelCoordinatesChart plotData={plotData} selectedPoints={selectedPoints}/>
          </div>
           <div className="w-2/6 bg-white shadow-md rounded">
            <LineChart plotData={plotData} highlightedID={highlightedID} />
          </div>
           <div className="w-2/6 bg-white shadow-md rounded">
            <ScatterChart plotData={plotData} onPointsSelected={handlePointsSelected}  />
          </div>
        </div>
     </div>
  );
}
