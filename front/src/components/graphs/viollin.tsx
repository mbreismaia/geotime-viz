import Plot from 'react-plotly.js';
import { useEffect, useState } from "react";
import { ChartProps } from "@/types/types";
import { getColorScale } from "@/components/color_scale/colorScale";
import { Button } from '@nextui-org/react';

interface ViolinPlotProps extends ChartProps {
  selectedPoints: any[];
  onHover: (id: string) => void;  
}

const ViolinPlot = ({ plotData, selectedPoints, onHover }: ViolinPlotProps) => {
  const [coloringMethod, setColoringMethod] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(0); 
  const itemsPerPage = 10; 

  useEffect(() => {
    const savedParameters = localStorage.getItem("savedParameters");
    if (savedParameters) {
      const parsedParameters = JSON.parse(savedParameters);
      setColoringMethod(parsedParameters.coloring_method || null);
    }
  }, []);

  const handleHover = (event: any) => {
    if (event?.points && event.points.length > 0) {
      const id = event.points[0].data.customdata; 
      // console.log("Hovered ID:", id);
      onHover(id); 
    }
  };

  if (!plotData || plotData.length === 0) {
    return <div>No data available</div>;
  }

  const sortedData = [...plotData].sort((a, b) => a.extremal_depth - b.extremal_depth);

  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = sortedData.slice(startIndex, endIndex);

  const colorScaleConfig = getColorScale(coloringMethod as keyof typeof getColorScale);

  const data = paginatedData.map((item) => {
    const date = new Date(item.date);
    let color = null;

    const isSelected = selectedPoints.some((point) => point.id === item.id);
    const opacity = isSelected || selectedPoints.length === 0 ? 1 : 0.3;
    
    if (coloringMethod === "Month") {
      color = colorScaleConfig.colors[date.getMonth()];
    } else if (coloringMethod === "Weekday") {
      color = colorScaleConfig.colors[date.getDay()];
    }
    return {
      type: 'violin',
      y: item.depth_g,
      name: date.toISOString().split('T')[0],
      hoverinfo: 'y+name+text',
      text: `ED: ${item.extremal_depth}`,
      customdata: item.id,  
      box: { visible: true },
      meanline: { visible: true },
      line: { color },
      opacity,
    };
  });

  const layout = {
    autosize: true,
    paper_bgcolor: 'transparent',
    plot_bgcolor: 'transparent',
    margin: { l: 50, r: 50, b: 70, t: 30 },
    xaxis: {
      title: 'Date',
      type: 'category',
    },
    yaxis: {
      title: 'Depth_g',
    },
  };

  const handleNextPage = () => {
    if (endIndex < sortedData.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="flex flex-col relative w-full h-full overflow-hidden">
      <div className="flex justify-between items-center">
        <button
          className={`px-4 py-2 border border-gray-300 text-gray-700 rounded hover:text-white hover:bg-blue-500 transition`}
          onClick={handlePreviousPage}
          disabled={currentPage === 0}
        >
          &lt; Prev
        </button>
        <span className="text-gray-700">
          Violins ordered from smallest to biggest ED ({currentPage + 1}/{Math.ceil(sortedData.length / itemsPerPage)})
        </span>
        <button
          className={`px-4 py-2 border border-gray-300 text-gray-700 rounded hover:text-white hover:bg-blue-500 transition`}
          onClick={handleNextPage}
          disabled={endIndex >= sortedData.length}
        >
          Next &gt;
        </button>
      </div>

      <Plot
        data={data}
        layout={layout}
        useResizeHandler={true}
        style={{ width: '100%', height: '100%' }}
        onHover={handleHover}
      />
    </div>
  );
};

export default ViolinPlot;
