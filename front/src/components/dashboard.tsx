"use client";
import { useEffect, useState } from "react";
import LineChart from "./graphs/lineChart";
import ParallelCoordinatesChart from "./graphs/parallelCord";
import TSNEChart from "./graphs/tsneChart";
import ViolinPlot from "./graphs/viollin";
import Map from "./graphs/map";

export default function Dashboard() {
  const [plotData, setPlotData] = useState<any>(null); // Inicialmente sem dados

  useEffect(() => {
    // Tentando recuperar os dados do localStorage
    const savedPlotData = localStorage.getItem("plotData");

    console.log("Dados recuperados do localStorage:", savedPlotData); // Verificando o que está no localStorage

    if (savedPlotData) {
      const parsedData = JSON.parse(savedPlotData);
      console.log("Dados parseados do localStorage:", parsedData); // Verificando os dados parseados

      // Passa o array completo de 'data' para o estado 'plotData'
      setPlotData(parsedData.data); // Agora, passando o array inteiro de dados
    } else {
      console.log("Nenhum dado encontrado no localStorage.");
    }
  }, []); 

  console.log("Estado do plotData no Dashboard:", plotData); // Verificando o valor do estado 'plotData'

  if (!plotData) {
    return <div>Loading data...</div>; // Exibe uma mensagem de carregamento se os dados não estiverem prontos
  }

  return (
    <div className="grid grid-cols-1 gap-4 w-full h-screen p-4">
      <div className="grid grid-cols-2 gap-x-2">
        <div className="flex p-2 bg-white shadow-md rounded-lg h-72 justify-center items-center">
          <LineChart plotData={plotData} />
        </div>
        <div className="flex p-2 bg-white shadow-md rounded-lg h-72 justify-center items-center">
          <ParallelCoordinatesChart />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-x-2">
        <div className="flex p-2 bg-white shadow-md rounded-lg h-72 justify-center items-center">
          <TSNEChart />
        </div>
        <div className="flex p-2 bg-white shadow-md rounded-lg h-72 justify-center items-center">
          <ViolinPlot />
        </div>
        <div className="flex p-2 bg-white shadow-md rounded-lg h-72 justify-center items-center">
          <Map />
        </div>
      </div>
    </div>
  );
}
