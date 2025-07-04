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

const ParallelCoordinatesChart = ({ plotData }: ChartProps) => {
  const [method, setMethod] = useState<'Month' | 'Weekday' | null>(null);
  
  useEffect(() => {
    const savedParameters = localStorage.getItem('savedParameters');
    if (savedParameters) {
      const parameters = JSON.parse(savedParameters);
      setMethod(parameters.coloring_method);
    }
  }, []);

  if (!plotData || method === null) return null;

  const variables = Object.keys(plotData[0].ED_parallel); // dynamically extract variables
  const ids = plotData.map((item) => item.id);

  const colorScale = getColorScale(method); 

  const colorIndices = plotData.map((item) => {
    const date = new Date(item.date);
    return method === 'Month' ? date.getMonth() : date.getDay(); 
  });

  const uniqueIndices = Array.from(new Set(colorIndices.filter(index => index >= 0)))
    .sort((a, b) => a - b);
  
  const filteredColors = uniqueIndices.map(index => colorScale.colors[index]);
  const filteredLabels = uniqueIndices.map(index => colorScale.labels[index]);

  const mappedColors = colorIndices.map((colorIndex) =>
    colorIndex >= 0 ? filteredColors[uniqueIndices.indexOf(colorIndex)] : '#ddd'
  );

  const colorScaleData = filteredColors.map((color, i) => [
    i / Math.max(1, (filteredColors.length - 1)),
    color,
  ]);

  const dimensions = variables.map((variable) => ({
    label: variable,
    values: plotData.map((item) => item.ED_parallel[variable]),
  }));

  dimensions.push({
    label: 'ID',
    values: ids,
  });

  const data = [
    {
      type: 'parcoords',
      line: {
        color: colorIndices,
        colorscale: colorScaleData,
        showscale: true,
        colorbar: {
          tickvals: uniqueIndices.map((_, i) => i),
          ticktext: filteredLabels,
        },
      },
      dimensions,
    },
  ];

  const layout = {
    margin: { l: 50, r: 50, t: 50, b: 50 },
    autosize: true,
  };

  return (
    <div className="relative w-full h-full overflow-hidden">
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
