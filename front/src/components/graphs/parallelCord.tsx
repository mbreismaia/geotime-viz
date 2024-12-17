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
      setMethod(parameters.coloring_method); // Carregar o método de coloração
    }
  }, []);

  if (!plotData || method === null) return null;

  const values = plotData.map((item) => item.ED_parallel.values);
  const prices = plotData.map((item) => item.ED_parallel.prices);
  const distances = plotData.map((item) => item.ED_parallel.distances);
  const totalTime = plotData.map((item) => item.ED_parallel.total_time);
  const ids = plotData.map((item) => item.id);

  const colorScale = getColorScale(method); // Obter a escala de cores

  // Mapear cores com base no método
  const colors = plotData.map((item) => {
    const date = new Date(item.date);
    const month = date.getMonth(); // Mês (0 a 11)
    const day = date.getDay(); // Dia da semana (0 = Domingo, 6 = Sábado)

    if (method === 'Month') {
      return month; // Usar o mês como índice de cor
    } else if (method === 'Weekday') {
      return day; // Usar o dia da semana como índice de cor
    }
    return -1; // Caso padrão
  });

  // Mapear cores de acordo com o método
  const mappedColors = colors.map((colorIndex) => {
    if (method === 'Month' && colorIndex >= 0) {
      return colorScale.colors[colorIndex]; // Cor do mês
    } else if (method === 'Weekday' && colorIndex >= 0) {
      return colorScale.colors[colorIndex]; // Cor do dia da semana
    }
    return '#ddd'; // Cor padrão
  });

  const data = [
    {
      type: 'parcoords',
      line: {
        color: colors,
        colorscale: method === 'Month'
          ? colorScale.colors.map((color, i) => [i / (colorScale.colors.length - 1), color])
          : method === 'Weekday'
          ? colorScale.colors.map((color, i) => [i / (colorScale.colors.length - 1), color])
          : [],
        showscale: true,
        colorbar: {
          tickvals: method === 'Month' 
            ? Array.from({ length: colorScale.colors.length }, (_, i) => i) 
            : method === 'Weekday' 
            ? Array.from({ length: colorScale.colors.length }, (_, i) => i) 
            : [],
          ticktext: method === 'Month' 
            ? colorScale.labels 
            : method === 'Weekday' 
            ? colorScale.labels 
            : [],
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
