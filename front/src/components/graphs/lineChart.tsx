import { ChartProps } from "@/types/types";
import React, { useState } from "react";
import Plot from "react-plotly.js";

const LineChart = ({ plotData }: ChartProps) => {
  const [selectedVariable, setSelectedVariable] = useState<string>("distances");

  if (!plotData || plotData.length === 0) {
    console.log("Aguardando dados...");
    return <div>Loading...</div>;
  }

  const variables = Object.keys(plotData[0].data);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toISOString().split("T")[0]; // Formata para ano-mês-dia
  };

  const traces = plotData.map(item => ({
    x: Array.from({ length: item.data[selectedVariable as keyof typeof item.data].length }, (_, i) => `${i}:00`),
    y: item.data[selectedVariable as keyof typeof item.data],
    type: "scatter",
    mode: "lines",
    line: { shape: "spline" },
    name: formatDate(item.date), // Formatar a data para ano-mês-dia
  }));

  const handleVariableSelection = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedVariable(event.target.value);
  };

  return (
    <div className="relative w-full h-full">
      <div className="absolute top-2 left-2 z-10 w-fit h-fit">
        <select
          id="variable-select"
          onChange={handleVariableSelection}
          className="mt-1 block w-full border border-gray-300 bg-white rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          {variables.map(variable => (
            <option key={variable} value={variable}>
              {variable.charAt(0).toUpperCase() + variable.slice(1)} {/* Capitalize */}
            </option>
          ))}
        </select>
      </div>

      {/* Gráfico */}
      <Plot
        className="bg-white shadow-md"
        data={traces}
        layout={{
          xaxis: { 
            title: "Hours", 
            tickmode: "linear", 
            dtick: 4  
          },
          yaxis: { title: selectedVariable.charAt(0).toUpperCase() + selectedVariable.slice(1) },
          showlegend: true,
          width: 600,
          height: 300,
          autosize: true,
          paper_bgcolor: "transparent", 
          plot_bgcolor: "transparent", 
        }}
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
};

export default LineChart;
