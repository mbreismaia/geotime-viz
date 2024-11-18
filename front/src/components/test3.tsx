"use client"
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Plot from 'react-plotly.js';

interface PlotParameters {
  plot: string;
  runED: boolean;       
  variables: string[]; 
  hour_interval: [number, number];
  date_interval: [string, string];
  coloring_method: string;
  depth_type: string;      
  dim_reduction_technique: string;
  reference_point: string;
  days_of_week: string[];
}

const LinePlot: React.FC = () => {
  const [plotData, setPlotData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      // Tipagem antes de enviar
      const plot_parameters: PlotParameters = {
        plot: "line", // Garantindo que é um gráfico de linha
        runED: false,
        variables: ["values", "prices", "distances", "total_time"],
        hour_interval: [0, 23],
        date_interval: ["2012-01-01", "2012-01-31"],
        coloring_method: "Month",
        depth_type: "L2",
        dim_reduction_technique: "UMAP",
        reference_point: "Origin",
        days_of_week: ["Monday", "Tuesday", "Wednesday"]
      };

      try {
        const response = await axios.post('http://127.0.0.1:8000/api/line_plot', plot_parameters);
        setPlotData(response.data.data);
        setLoading(false);
      } catch (error) {
        setError('Erro ao carregar os dados');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const trace = {
    x: plotData[0]?.data["distances"], // Distância no eixo x
    y: plotData[0]?.data["prices"], // Preço no eixo y
    type: 'scatter',
    mode: 'lines', // Gráfico de linhas
    line: { color: 'blue' },
  };

  return (
    <div>
      <Plot
        data={[trace]}
        layout={{
          title: 'Preço vs Distância',
          xaxis: { title: 'Distância' },
          yaxis: { title: 'Preço' },
        }}
      />
    </div>
  );
};

export default LinePlot;
