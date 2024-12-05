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
     <div className="flex flex-col w-full h-full bg-gray-100 ">
        <div className="flex p-2 justify-evenly h-2/6">
          <div className="w-1/2">
            < Map />
          </div>
          <div className="w-1/2">
            <LineChart plotData={plotData} />
          </div>
        </div>

        <div className="flex justify-evenly">
          <div className="bg-white shadow-md rounded">
            Grafico 3
          </div>
           <div className="bg-white shadow-md rounded">
            Grafico 4
          </div>
           <div className="bg-white shadow-md rounded">
            Grafico 5
          </div>
        </div>
     </div>
  );
}
