// components/TaxiRunsPlot.tsx
import React from 'react';
import Plot from 'react-plotly.js';

const TaxiRunsPlot = () => {
  // Example data: replace these with your actual data
  const data = [
    {
      x: Array.from({ length: 24 }, (_, i) => i), // hours of the day
      y: [56, 120, 180, 220, 150, 90, 70, 30, 120, 180, 230, 280, 300, 250, 220, 180, 150, 120, 90, 70, 60, 80, 120, 150], // values for one day
      type: 'scatter',
      mode: 'lines+markers',
      name: 'Taxi Runs on 11-03-2012',
      line: { color: 'purple' },
    },
    {
      x: Array.from({ length: 24 }, (_, i) => i), // hours of the day
      y: [70, 130, 210, 250, 170, 110, 80, 40, 150, 200, 260, 310, 320, 270, 240, 200, 160, 130, 100, 80, 70, 90, 140, 160], // values for another day
      type: 'scatter',
      mode: 'lines+markers',
      name: 'Taxi Runs on 31-03-2012',
      line: { color: 'orange' },
    },
  ];

  const layout = {
    title: 'Amount of Taxi Runs by Hour of Day',
    xaxis: {
      title: 'Hour of Day',
    },
    yaxis: {
      title: 'Amount of Taxi Runs',
    },
    width: 550,
    height: 280,
  };

  return <Plot data={data} layout={layout} />;
};

export default TaxiRunsPlot;
