import { ChartProps } from "@/types/types";
import Plot from "react-plotly.js";
import { useEffect, useState } from "react";
import { getColorScale } from "@/components/color_scale/colorScale";

const ScatterChart = ({ plotData }: ChartProps) => {
  const [coloringMethod, setColoringMethod] = useState<string | null>(null);
  const [reductionTechnique, setReductionTechnique] = useState<string | null>(null);

  useEffect(() => {
    // Recuperar os parâmetros do localStorage
    const savedParameters = localStorage.getItem("savedParameters");
    if (savedParameters) {
      const parsedParameters = JSON.parse(savedParameters);
      setColoringMethod(parsedParameters.coloring_method || null);
      setReductionTechnique(parsedParameters.dim_reduction_technique || null);
    }
  }, []);

  if (!plotData || plotData.length === 0) {
    return <div>No data available</div>;
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  };

  const colorScaleConfig = getColorScale(coloringMethod as keyof typeof getColorScale);

  const data = [
    {
      x: plotData.map(item => item.x),
      y: plotData.map(item => item.y),
      text: plotData.map(item => {
        const date = new Date(item.date);
        const weekDayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        return `ID: ${item.id}<br>Date: ${formatDate(item.date)}<br>Weekday: ${weekDayNames[date.getDay()]}<br>ED: ${item.extremal_depth.toFixed(2)}`;
      }),
      mode: "markers",
      marker: {
        size: 10,
        color: plotData.map(item => {
          const date = new Date(item.date);
          if (coloringMethod === "Month") {
            return colorScaleConfig.colors[date.getMonth()]; 
          } else if (coloringMethod === "Weekday") {
            return colorScaleConfig.colors[date.getDay()]; 
          }
          return null; 
        }),
        colorscale: colorScaleConfig?.colors || "Viridis", 
        showscale: true,
        colorbar: {
          title: coloringMethod || "Color Scale",
          tickvals: colorScaleConfig?.labels.map((_, idx) => idx) || undefined,
          ticktext: colorScaleConfig?.labels || undefined,
        },
      },
      type: "scatter",
    },
  ];

  const layout = {
    // title: `Redução de dimensionalidade dos dados utilizando ${reductionTechnique || "Método não especificado"}`,
    xaxis: {
      title: "X",
    },
    yaxis: {
      title: "Y",
    },
    margin: { l: 50, r: 50, b: 50, t: 50 }, 
    autosize: true, 
    paper_bgcolor: "transparent", 
    plot_bgcolor: "transparent",
  };

  return (
    <div className="relative w-full h-full">
      <Plot
        data={data}
        layout={layout}
        useResizeHandler={true} 
        style={{ width: "100%", height: "100%" }} 
      />
    </div>
  );
};

export default ScatterChart;
