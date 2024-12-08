import { ChartProps } from '@/types/types';
import Plot from 'react-plotly.js';

const ScatterChart = ({ plotData }: ChartProps) => {
  if (!plotData || plotData.length === 0) {
    return <div>No data available</div>;
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0]; 
  };

  const data = [
    {
      x: plotData.map(item => item.x), 
      y: plotData.map(item => item.y), 
      text: plotData.map(item => `ID: ${item.id}<br>Data: ${formatDate(item.date)}`), 
      mode: 'markers',
      marker: {
        size: 10,
        color: plotData.map(item => item.id), 
        colorscale: 'Viridis',
        showscale: true, 
      },
      type: 'scatter',
    },
  ];

  const layout = {
    title: 'Scatter Plot',
    xaxis: {
      title: 'X',
    },
    yaxis: {
      title: 'Y',
    },
  };

  return (
    <div>
      <Plot data={data} layout={layout} />
    </div>
  );
};

export default ScatterChart;
