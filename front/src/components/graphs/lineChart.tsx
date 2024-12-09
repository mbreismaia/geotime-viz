import { ChartProps } from "@/types/types";
import React, { useState, useEffect } from "react";
import Plot from "react-plotly.js";
import { getColorScale } from "@/components/color_scale/colorScale";

const LineChart = ({ plotData }: ChartProps) => {
  const [selectedVariable, setSelectedVariable] = useState<string>("values");
  const [coloringMethod, setColoringMethod] = useState<string | null>(null);

  useEffect(() => {
    // Retrieve parameters from localStorage
    const savedParameters = localStorage.getItem("savedParameters");
    if (savedParameters) {
      const parsedParameters = JSON.parse(savedParameters);
      setColoringMethod(parsedParameters.coloring_method || null);
    }
  }, []);

  if (!plotData || plotData.length === 0) {
    console.log("Aguardando dados...");
    return <div>Loading...</div>;
  }

  const variables = Object.keys(plotData[0].data);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toISOString().split("T")[0]; // Formata para ano-mês-dia
  };

  // Get the color scale configuration
  const colorScaleConfig = getColorScale(coloringMethod as keyof typeof getColorScale);

  // Prepare the traces for the line chart
  const traces = plotData.map(item => {
    const date = new Date(item.date);
    let color = "#000000"; // Default color

    if (coloringMethod === "Month" && colorScaleConfig) {
      color = colorScaleConfig.colors[date.getMonth()];
    } else if (coloringMethod === "Weekday" && colorScaleConfig) {
      color = colorScaleConfig.colors[date.getDay()];
    }

    return {
      x: Array.from({ length: item.data[selectedVariable as keyof typeof item.data].length }, (_, i) => `${i}:00`),
      y: item.data[selectedVariable as keyof typeof item.data],
      type: "scatter",
      mode: "lines",
      line: {
        shape: "spline",
        color, // Set the line color
        width: 2,
      },
      name: formatDate(item.date), // Format the date for display
    };
  });

  const handleVariableSelection = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedVariable(event.target.value);
  };

  return (
    <div className="relative w-full h-full">
      {}
      <div className="absolute top-2 left-2 z-10 w-fit h-fit">
      <select
        id="variable-select"
        onChange={handleVariableSelection}
        className="mt-1 block w-full border border-gray-300 bg-white rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm hover:border-indigo-500 focus:outline-none transition duration-200 ease-in-out px-4 py-2"
      >
        {variables.map(variable => (
          <option key={variable} value={variable}>
            {variable.charAt(0).toUpperCase() + variable.slice(1)} {}
          </option>
        ))}
      </select>
      </div>

      {/* Line Chart */}
      <Plot
        className="bg-white shadow-md"
        data={traces}
        layout={{
          xaxis: {
            title: "Hours",
            tickmode: "linear",
            dtick: 4,
          },
          yaxis: {
            title: selectedVariable.charAt(0).toUpperCase() + selectedVariable.slice(1),
          },
          showlegend: true,
          autosize: true,
          paper_bgcolor: "transparent",
          plot_bgcolor: "transparent",
        }}
        useResizeHandler={true} // Enable resizing
        style={{ width: "100%", height: "100%" }} // Make it responsive
      />
    </div>
  );
};

export default LineChart;
