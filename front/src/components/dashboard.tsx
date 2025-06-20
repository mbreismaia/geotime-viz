"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { ChartProps } from "@/types/types";
import dynamic from "next/dynamic";
import Loading from "./loading";
import { useParameters } from "@/components/context/ParametersContext";

const Map = dynamic(() => import("./graphs/map"), { ssr: false });
const LineChart = dynamic(() => import("./graphs/lineChart"), { ssr: false });
const ParallelCoordinatesChart = dynamic(() => import("./graphs/parallelCord"), { ssr: false });
const ViolinPlot = dynamic(() => import("./graphs/viollin"), { ssr: false });
const ScatterChart = dynamic(() => import("./graphs/scatterChart"), { ssr: false });


type DashboardProps = {
  selectedChart: string;
};

export default function Dashboard({ selectedChart }: DashboardProps) {
  const { parameters, setParameters } = useParameters();
  const [plotData, setPlotData] = useState<ChartProps["plotData"]>(null); 
  const [selectedPoints, setSelectedPoints] = useState<any[]>([]);
  const [highlightedID, setHighlightedID] = useState<string | null>(null); 


  const handlePointsSelected = (points: any[]) => {
    setSelectedPoints(points);
  };

  const handleHover = (id: string) => {
    // console.log("ID destacado:", id);
    setHighlightedID(id);
  };

  useEffect(() => {
  const fetchPlotData = async () => {
    try {
      console.log("Parameters being sent:", parameters);
      const response = await axios.post("http://127.0.0.1:8000/api/plot_data", parameters);
      console.log("Response:", response);
      setPlotData(response.data.data);
    } catch (error) {
      console.error("Error fetching plot data:", error);
    }
  };

  fetchPlotData();
}, []);


  // Tela de Carregando os dados
  if (!plotData) {
    return <Loading />;
  }

  const renderChart = () => {
    switch (selectedChart) {
      case 'map':
        return (
          <div className="w-[800px] h-[600px] shadow-md rounded bg-white">
            <Map plotData={plotData} />
          </div>
        );
      case 'line':
        return <div className="w-full h-auto bg-white rounded p-2">
          <LineChart plotData={plotData} highlightedID={highlightedID} selectedPoints={selectedPoints} />
        </div>;
      case 'parallel':
        return <div className="w-full h-auto bg-white rounded p-2">
            <ParallelCoordinatesChart plotData={plotData}/>
          </div>;
      case 'scatter':
        return <div className="w-full h-auto bg-white rounded p-2">
          <ScatterChart plotData={plotData} onPointsSelected={handlePointsSelected}/>
        </div>;
      case 'violin':
        return <div className="w-full h-auto bg-white rounded p-2">
          <ViolinPlot plotData={plotData} selectedPoints={selectedPoints} onHover={handleHover}/>
        </div>;
      default:
        return (
          <>
          <div className="flex w-full h-1/2 gap-x-4">
            <div className="w-1/2 overflow-hidden shadow-md rounded bg-white">
              < Map plotData={plotData} />
            </div>
            <div className="w-1/2 p-2 overflow-hidden shadow-md rounded bg-white">
              <ViolinPlot plotData={plotData} selectedPoints={selectedPoints} onHover={handleHover}/>
            </div>
          </div>

          <div className="flex w-full h-1/2 gap-x-4  overflow-hidden">
            <div className="w-2/6 bg-white shadow-md rounded">
              <ParallelCoordinatesChart plotData={plotData}/>
            </div>
            <div className="w-2/6 bg-white shadow-md rounded">
              <LineChart plotData={plotData} highlightedID={highlightedID} selectedPoints={selectedPoints} />
            </div>
            <div className="w-2/6 bg-white shadow-md rounded">
              <ScatterChart plotData={plotData} onPointsSelected={handlePointsSelected}  />
            </div>
          </div>
          </>
        );
    }
  };

  return (
     <div className="flex flex-col justify-center items-center w-full h-svh bg-gray-100 p-4 gap-y-4 overflow-hidden">
        {renderChart()}
     </div>
  );
}
