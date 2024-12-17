import React, { useEffect, useState } from 'react';
import Plot from 'react-plotly.js';
import { ChartProps } from '@/types/types';
import { getColorScale } from '../color_scale/colorScale';

const ParallelCoordinatesChart = ({ plotData }: ChartProps) => {
  const [method, setMethod] = useState<'Month' | 'Weekday' | null>(null);

  useEffect(() => {
    const savedParameters = localStorage.getItem('savedParameters');
    if (savedParameters) {
      const parameters = JSON.parse(savedParameters);
      setMethod(parameters.coloring_method);
      // console.log('coloringMethod:', parameters.coloring_method);
    }
  }, []);

  if (!plotData || method === null) return null;

  const values = plotData.map((item) => item.ED_parallel.values);
  const prices = plotData.map((item) => item.ED_parallel.prices);
  const distances = plotData.map((item) => item.ED_parallel.distances);
  const totalTime = plotData.map((item) => item.ED_parallel.total_time);
  const ids = plotData.map((item) => item.id);

  const colorScale = getColorScale(method);
  // console.log('Color Scale:', colorScale);

  const colors = plotData.map((item) => {
    const date = new Date(item.date);
    const colorIndex = method === 'Month' ? date.getMonth() : date.getDay();
    return colorIndex;
  });

  const uniqueColors = Array.from(new Set(colors));
  const mappedColors = colors.map((colorIndex) => {
    return colorScale.colors[colorIndex];
  });

  const data = [
    {
      type: 'parcoords',
      line: {
        color: colors, 
        colorscale: method === 'Month'
          ? [[0, colorScale.colors[uniqueColors[0]]], [1, colorScale.colors[uniqueColors[0]]]] 
          : colorScale.colors.map((color, i) => [i / (colorScale.colors.length - 1), color]),
        showscale: true,
        colorbar: {
          tickvals: method === 'Month' ? [0] : colorScale.colors.map((_, i) => i),
          ticktext: method === 'Month' ? [colorScale.labels[uniqueColors[0]]] : colorScale.labels,
        },
      },
      dimensions: [
        {
          label: 'Values',
          values: values,
        },
        {
          label: 'Prices',
          values: prices,
        },
        {
          label: 'Distances',
          values: distances,
        },
        {
          label: 'Total Time',
          values: totalTime,
        },
        {
          label: 'ID',
          values: ids,
        },
      ],
    },
  ];

  const layout = {
    margin: { l: 50, r: 50, t: 50, b: 50 },
    autosize: true,
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
