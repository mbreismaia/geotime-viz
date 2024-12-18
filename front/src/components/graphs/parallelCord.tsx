import React, { useEffect, useState } from 'react';
import Plot from 'react-plotly.js';
import { ChartProps } from '@/types/types';

const colors: Record<string, string[]> = {
  Month: [
    '#2e91e5', '#e15f99', '#1ca71c', '#fb0d0d', 
    '#da16ff', '#222a2a', '#b68100', '#750d86', 
    '#eb663b', '#511cfb', '#00a08b', '#fb00d1'
  ],
  Weekday: [
    '#636efa', '#ef553b', '#00cc96', '#ab63fa', 
    '#ffa15a', '#19d3f3', '#8c564b'
  ],
};

const getColorScale = (method: 'Month' | 'Weekday') => {
  return {
    colors: colors[method] || [],
    labels: method === 'Month' 
      ? ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  };
};

const ParallelCoordinatesChart: React.FC<ChartProps> = ({ plotData }) => {
  const [method, setMethod] = useState<'Month' | 'Weekday' | null>(null);
  
  useEffect(() => {
    const savedParameters = localStorage.getItem('savedParameters');
    if (savedParameters) {
      const parameters = JSON.parse(savedParameters);
      setMethod(parameters.coloring_method);
    }
  }, []);

  if (!plotData || method === null) return null;

  const values = plotData.map((item) => item.ED_parallel.values);
  const prices = plotData.map((item) => item.ED_parallel.prices);
  const distances = plotData.map((item) => item.ED_parallel.distances);
  const totalTime = plotData.map((item) => item.ED_parallel.total_time);
  const ids = plotData.map((item) => item.id);

  const colorScale = getColorScale(method); 

  const colorIndices = plotData.map((item) => {
    const date = new Date(item.date);
    return method === 'Month' ? date.getMonth() : date.getDay(); 
  });

  const uniqueMonths = Array.from(new Set(colorIndices.filter(index => index >= 0))); 

  const filteredColors = uniqueMonths.map(monthIndex => colorScale.colors[monthIndex]);
  const filteredLabels = uniqueMonths.map(monthIndex => colorScale.labels[monthIndex]);

  const mappedColors = colorIndices.map((colorIndex) =>
    colorIndex >= 0 ? filteredColors[uniqueMonths.indexOf(colorIndex)] : '#ddd'
  );

  const colorScaleData = filteredColors.map((color, i) => [i / (filteredColors.length - 1), color]);

  const data = [
    {
      type: 'parcoords',
      line: {
        color: colorIndices,
        colorscale: colorScaleData,
        showscale: true,
        colorbar: {
          tickvals: Array.from({ length: filteredColors.length }, (_, i) => i),
          ticktext: filteredLabels,
        },
      },
      dimensions: [
        { label: 'Values', values: values },
        { label: 'Prices', values: prices },
        { label: 'Distances', values: distances },
        { label: 'Total Time', values: totalTime },
        { label: 'ID', values: ids },
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
