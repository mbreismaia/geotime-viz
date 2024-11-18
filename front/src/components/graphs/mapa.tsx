"use client"

import React from 'react';
import Plot from 'react-plotly.js';

const USAStatesMap = () => {
  const data = [
    {
      type: 'choropleth',
      locationmode: 'USA-states',
      locations: ['TX', 'CA', 'NY', 'FL', 'IL'], // Exemplos de estados
      z: [10, 20, 30, 40, 50], // Valores para as cores (isso pode ser alterado dinamicamente)
      hoverinfo: 'location+z',
      colorscale: 'Viridis',
    },
  ];

  const layout = {
    geo: {
      scope: 'usa',
      projection: { type: 'albers usa' },
      showland: true,
      landcolor: 'rgb(255, 255, 255)',
    },
    width: 600,  // Largura do gráfico
    height: 400, // Altura do gráfico
  };

  return <Plot data={data} layout={layout} />;
};

export default USAStatesMap;
