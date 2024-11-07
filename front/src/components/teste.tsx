"use client"
import React, { useEffect, useState } from 'react';
import Plot from 'react-plotly.js';
import { fetchPlotData } from '../services/api';
import { GraphData } from '@/types/graphData';

interface PlotProps {
  plotType: string;
  params: any;
}

const PlotComponent: React.FC<PlotProps> = ({ plotType, params }) => {
  const [data, setData] = useState<GraphData[]>([]);

  useEffect(() => {
    const getData = async () => {
      const fetchedData = await fetchPlotData(plotType, params);
      setData(fetchedData);
    };
    getData();
  }, [plotType, params]);

  const plotValues = data.map(d => ({
    x: d.date,
    y: d.values,
    type: 'scatter',
    mode: 'lines+markers',
    name: `ID: ${d.id}`
  }));

  return (
    <Plot
      data={plotValues}
      layout={{ title: 'Gráfico de Dados' }}
    />
  );
};

export default PlotComponent;
