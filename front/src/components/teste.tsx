"use client"
import { useEffect, useState } from 'react';
import Plot from 'react-plotly.js';
import axios from 'axios';

interface PlotData {
  x: number;
  y: number;
}

interface PlotParameters {
  plot: string;
  runED: boolean;
  variables: string[];
  hour_interval: number[];
  date_interval: string[];
  coloring_method: string;
  depth_type: string;
  dim_reduction_technique: string;
  reference_point: string;
  days_of_week: string[];
}

const PlotComponent = () => {
  const [plotData, setPlotData] = useState<PlotData[]>([]);

  useEffect(() => {
    const plot_parameters: PlotParameters =  {plot: "line", runED: false, variables: ["values", "prices", "distances", "total_time"], 
      hour_interval: [0, 23], date_interval: ["2012-01-01", "2012-01-31"], coloring_method: "Month", depth_type: "L2", 
      dim_reduction_technique: "UMAP", reference_point: "Origin", 
      days_of_week: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]};

    const fetchPlotData = async () => {
      try {
        const response = await axios.post("http://127.0.0.1:8000/api/line_plot", plot_parameters);
        console.log("Resposta da requisicao: ", response);
        setPlotData(response.data);
      } catch (error) {
        alert("Erro ao buscar dados");
        console.error("Erro ao buscar dados: ", error);
      }
    };

    fetchPlotData();
  }, []);

  if (plotData.length === 0) {
    return <div>Carregando...</div>;
  }

  const plotTrace = {
    x: plotData.map((d) => d.x),
    y: plotData.map((d) => d.y),
    mode: 'markers',
    type: 'scatter',
  };

  return (
    <div>
      <Plot
        data={[plotTrace]}
        layout={{
          title: 'Gráfico de Dispersão',
          xaxis: { title: 'X' },
          yaxis: { title: 'Y' },
        }}
      />
    </div>
  );
};

export default PlotComponent;
