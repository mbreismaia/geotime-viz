"use client";
import { useEffect, useState } from "react";
import LineChart from "./graphs/lineChart";
import Map from "./graphs/map";
import { LineChartProps } from "@/types/types";


export default function Dashboard() {
  const [plotData, setPlotData] = useState<LineChartProps["plotData"]>(null); 

  useEffect(() => {
    // Tentando recuperar os dados do localStorage
    const savedPlotData = localStorage.getItem("plotData");

    if (savedPlotData) {
      const parsedData = JSON.parse(savedPlotData);
      console.log("Dados parseados do localStorage:", parsedData);
      setPlotData(parsedData.data); 
    } else {
      console.log("Nenhum dado encontrado no localStorage.");
    }
  }, []); 

  if (!plotData) {
    return <div>Loading data...</div>; 
  }

  return (
    <div className="grid grid-cols-1 gap-4 w-full h-screen p-4">
      <div className="grid grid-cols-2 gap-x-2">
        <div className="flex p-2 bg-white shadow-md rounded-lg h-72 justify-center items-center">
          <Map />
        </div>
        <div className="flex p-2 bg-white shadow-md rounded-lg h-full justify-center items-center">
          <LineChart plotData={plotData} />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-x-2">
        <div className="flex p-2 bg-white shadow-md rounded-lg h-72 justify-center items-center">
          Grafico 3
        </div>
        <div className="flex p-2 bg-white shadow-md rounded-lg h-72 justify-center items-center">
          Grafico 4
        </div>
        <div className="flex p-2 bg-white shadow-md rounded-lg h-72 justify-center items-center">
          Grafico 5
        </div>
      </div>
    </div>
  );
}
