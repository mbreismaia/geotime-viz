import { ChartProps } from '@/types/types';
import React, { useEffect, useState } from 'react';
import Plot from 'react-plotly.js';
import { getColorScale } from "@/components/color_scale/colorScale";
import { coloring_method } from '../modal/modal';

interface ParallelPlotProps extends ChartProps {
  selectedPoints: any[]; 
}

const ParallelCoordinatesChart = ({ plotData, selectedPoints }: ParallelPlotProps) => {
  const [coloringMethod, setColoringMethod] = useState<string | null>(null);

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

  const variables = plotData[0]?.variables || [];
  const ids = plotData.map(item => item.id);
  const colorScaleConfig = getColorScale(coloringMethod as keyof typeof getColorScale);

  if (!colorScaleConfig) {
    return <div>Error: Invalid color scale configuration</div>;
  }

  const colorValues = plotData.map((_, index) => index); 
  const colorscale = colorScaleConfig.colors.map((color, idx) => [
    idx / (colorScaleConfig.colors.length - 1),
    color,
  ]);

  const visibility = plotData.map(item => {
    const isSelected = selectedPoints.some(point => {
      return point.id.toString() === item.id.toString();
    });
    return isSelected || selectedPoints.length === 0 ? true : false;
  });

  console.log('visibility parallel: ', visibility);

  const data = [
    {
      type: 'parcoords',
      line: {
        color: colorValues,
        colorscale: colorscale, 
        showscale: false,
      },
      visible: visibility,
      dimensions: [
        ...variables.map(variable => ({
          label: variable,
          values: plotData.map(item => item.ED_parallel[variable.toLowerCase() as keyof typeof item.ED_parallel]),
        })),
        {
          label: 'ID',
          values: ids,
        },
      ],
    },
  ];

  const layout = {
    autosize: true,
    paper_bgcolor: 'transparent',
    plot_bgcolor: 'transparent',
    margin: { l: 40, r: 40, b: 40, t: 50 },
  };

  return (
    <div className="relative w-full h-full">
      <Plot
        data={data}
        layout={layout}
        useResizeHandler={true}
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
};

export default ParallelCoordinatesChart;
