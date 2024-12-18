import { ChartProps } from "@/types/types";
import React, { useState, useEffect } from "react";
import Plot from "react-plotly.js";
import { getColorScale } from "@/components/color_scale/colorScale";

interface LineChartProps extends ChartProps {
  highlightedID: string | null;
  selectedPoints: any[]; 
}

const LineChart = ({ plotData, highlightedID, selectedPoints }: LineChartProps) => {
  const [selectedVariable, setSelectedVariable] = useState<string>("values");
  const [coloringMethod, setColoringMethod] = useState<string | null>(null);

  useEffect(() => {
    const savedParameters = localStorage.getItem("savedParameters");
    if (savedParameters) {
      const parsedParameters = JSON.parse(savedParameters);
      setColoringMethod(parsedParameters.coloring_method || null);
    }
  }, []);

  if (!plotData || plotData.length === 0) {
    return <div>Loading...</div>;
  }

  const variables = Object.keys(plotData[0].data);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  };

  const colorScaleConfig = getColorScale(coloringMethod as keyof typeof getColorScale);

  const opacities = plotData.map(item => {
    const isHighlighted = highlightedID?.toString() === item.id.toString();
    const isSelected = selectedPoints.some(point => point.id === item.id);
    return isHighlighted || isSelected ? 1 : 0.1; 
  });


  const traces = plotData.map((item, index) => {
    const date = new Date(item.date);
    let color = "#000000"; 

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
        color: color,
      },
      opacity: opacities[index],
      name: formatDate(item.date),
      hoverinfo: "name+y",
      text: `ID: ${item.id}`,
    };
  });

  const handleVariableSelection = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedVariable(event.target.value);
  };

  return (
    <div className="relative w-full h-full overflow-hidden">
      <div className="absolute top-2 left-2 z-10 w-fit h-fit">
        <select
          id="variable-select"
          onChange={handleVariableSelection}
          className="mt-1 block w-full border border-gray-300 bg-white rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm hover:border-indigo-500 focus:outline-none transition duration-200 ease-in-out p-1"
        >
          {variables.map((variable) => (
            <option key={variable} value={variable}>
              {variable.charAt(0).toUpperCase() + variable.slice(1)}
            </option>
          ))}
        </select>
      </div>

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
          modebar: {
            orientation: "v"          
          }
        }}
        useResizeHandler={true}
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
};

export default LineChart;
