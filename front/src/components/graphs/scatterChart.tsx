import { ChartProps } from "@/types/types";
import Plot from "react-plotly.js";
import { useEffect, useState } from "react";
import { getColorScale } from "@/components/color_scale/colorScale";
import { useParameters } from "@/components/context/ParametersContext";


interface ScatterChartProps extends ChartProps {
  onPointsSelected: (points: any[]) => void; 
}

const ScatterChart = ({ plotData, onPointsSelected }: ScatterChartProps) => {
  const { parameters } = useParameters();
  const coloringMethod = parameters.coloring_method;
  const reductionTechnique = parameters.dim_reduction_technique;
  const [selectedPoints, setSelectedPoints] = useState<any[]>([]);

  if (!plotData || plotData.length === 0) {
    return <div>No data available</div>;
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  };

  const colorScaleConfig = getColorScale(coloringMethod as keyof typeof getColorScale);

  const handleSelection = (event: any) => {
    if (event?.points && event.points.length > 0) {
      const newSelectedPoints = event.points.map((point: any) => ({
        id: plotData[point.pointIndex]?.id,
        date: plotData[point.pointIndex]?.date,
        extremalDepth: plotData[point.pointIndex]?.extremal_depth,
      }));
      setSelectedPoints(newSelectedPoints);
      onPointsSelected(newSelectedPoints); 
      // console.log("Selected points:", newSelectedPoints);
    } 
  };

  const opacities = plotData.map(item => {
    const isSelected = selectedPoints.some(point => point.id === item.id);
    return isSelected ? 1 : 0.3;
  });

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
        opacity: opacities, 
        colorscale: colorScaleConfig?.colors || "Viridis",
        showscale: false,
      },
      type: "scatter",
    },
  ];

  const layout = {
    xaxis: {
      title: "X",
    },
    yaxis: {
      title: "Y",
    },
    margin: { l: 50, r: 50, b: 50, t: 50 },
    autosize: true,
    modebar: {
      orientation: "v",        
    }
  };

  return (
    <div className="relative w-full h-full overflow-hidden">
      <Plot
        data={data}
        layout={layout}
        useResizeHandler={true}
        style={{ width: "100%", height: "100%" }}
        onSelected={handleSelection}
      />
    </div>
  );
};

export default ScatterChart;
