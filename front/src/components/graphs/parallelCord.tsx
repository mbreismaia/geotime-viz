import { ChartProps } from '@/types/types';
import React from 'react';
import Plot from 'react-plotly.js';

const ParallelCoordinatesChart: React.FC<ChartProps> = ({ plotData }) => {
  if (!plotData || plotData.length === 0) {
    return <div>No data available</div>;
  }

  // Extrair as variáveis e os dados para o gráfico
  const variables = plotData[0]?.variables || [];

  // Mapeando os dados de ED_parallel para o formato que Plotly espera
  const data = [
    {
      type: 'parcoords',
      line: { color: 'rgb(0, 0, 255)' },
      dimensions: variables.map((variable, index) => ({
        label: variable,
        values: plotData.map(item => item.ED_parallel[variable.toLowerCase() as keyof typeof item.ED_parallel])
      })),
    },
  ];

  const layout = {
    xaxis: {
      title: 'Dimensões',
    },
    yaxis: {
      title: 'Valor',
    },
  };

  return (
    <div>
      <Plot data={data} layout={layout} />
    </div>
  );
};

export default ParallelCoordinatesChart;
