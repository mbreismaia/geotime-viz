import { ChartProps } from '@/types/types';
import React from 'react';
import Plot from 'react-plotly.js';

const ParallelCoordinatesChart: React.FC<ChartProps> = ({ plotData }) => {
  if (!plotData || plotData.length === 0) {
    return <div>No data available</div>;
  }

  const variables = plotData[0]?.variables || [];

  const ids = plotData.map(item => item.id);

  const data = [
    {
      type: 'parcoords',
      line: {
        color: ids,
        colorscale: 'Viridis',
      },
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
