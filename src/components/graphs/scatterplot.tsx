"use client";
import { FC } from 'react';
import Plot from 'react-plotly.js';

const ScatterPlot: FC = () => {
  return (
    <div>
      <Plot
        data={[
          {
            x: ['2020-01-01', '2020-02-01', '2020-03-01'],
            y: [2, 6, 3],
            type: 'scatter',
            mode: 'lines+markers',
            marker: { color: 'red' },
          },
        ]}
        layout={{ title: 'My Line Chart' }}
      />
    </div>
  );
};

export default ScatterPlot;
