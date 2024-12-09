import Plot from 'react-plotly.js';
import { useEffect, useState } from "react";
import { ChartProps } from "@/types/types";
import { getColorScale } from "@/components/color_scale/colorScale";

const ViolinPlot = ({ plotData }: ChartProps) => {
  const [coloringMethod, setColoringMethod] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(0); // Estado para gerenciar a página atual
  const itemsPerPage = 10; // Número de violinos exibidos por vez

  useEffect(() => {
    const savedParameters = localStorage.getItem("savedParameters");
    if (savedParameters) {
      const parsedParameters = JSON.parse(savedParameters);
      setColoringMethod(parsedParameters.coloring_method || null);
    }
  }, []);

  if (!plotData || plotData.length === 0) {
    return <div>No data available</div>;
  }

  const sortedData = [...plotData].sort((a, b) => b.extremal_depth - a.extremal_depth);

  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = sortedData.slice(startIndex, endIndex);

  const colorScaleConfig = getColorScale(coloringMethod as keyof typeof getColorScale);

  const data = paginatedData.map((item) => {
    const date = new Date(item.date);
    let color = null;
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
      box: { visible: true },
      meanline: { visible: true },
      line: { color },
    };
  });

  const layout = {
    autosize: true,
    paper_bgcolor: 'transparent',
    plot_bgcolor: 'transparent',
    margin: { l: 50, r: 50, b: 50, t: 50 },
    xaxis: {
      title: 'Date',
      type: 'category', // Define o eixo como categórico
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
    <div className="relative w-full h-full">
      <div className="flex justify-between items-center mb-4 mx-4 my-4"> {}
        <button 
          onClick={handlePreviousPage} 
          disabled={currentPage === 0} 
          className="text-blue-500 border border-blue-500 px-4 py-2 rounded-md hover:bg-blue-500 hover:text-white disabled:border-gray-300 disabled:text-gray-300 disabled:hover:bg-transparent transition duration-200 ease-in-out"
        >
          &lt; Prev
        </button>
        <span className="text-gray-700">
            Violins ordered from smallest to biggest ED ({currentPage + 1}/{Math.ceil(sortedData.length / itemsPerPage)})
        </span>
        <button 
          onClick={handleNextPage} 
          disabled={endIndex >= sortedData.length} 
          className="text-blue-500 border border-blue-500 px-4 py-2 rounded-md hover:bg-blue-500 hover:text-white disabled:border-gray-300 disabled:text-gray-300 disabled:hover:bg-transparent transition duration-200 ease-in-out"
        >
          Next &gt;
        </button>
      </div>
      <Plot
        data={data}
        layout={layout}
        useResizeHandler={true}
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
};

export default ViolinPlot;
