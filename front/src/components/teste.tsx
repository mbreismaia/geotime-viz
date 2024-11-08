"use client"
import { useEffect, useState } from 'react';
import Plot from 'react-plotly.js';
import axios from 'axios';

// Tipo para os dados que esperamos da API
interface PlotData {
  x: number;
  y: number;
}

const PlotComponent = () => {
  const [plotData, setPlotData] = useState<PlotData[]>([]);  // Estado para armazenar os dados do gráfico

  useEffect(() => {
    // Parâmetros que você vai enviar para a API
   const parameters = {
      plot: "scatter",
      runED: true,
      variables: ["values", "prices", "distances"],
      hour_interval: [8, 17],  
      date_interval: ["2023-01-01", "2023-12-31"],
      coloring_method: "default", 
      depth_type: "L2",
      dim_reduction_technique: "UMAP",
      reference_point: "origin",
      days_of_week: ["Monday", "Tuesday"]
    };

    // Função para buscar os dados da API
    const fetchPlotData = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/scatter_plot", { params: parameters });
        setPlotData(response.data);  // Armazena os dados no estado
      } catch (error) {
        alert("Erro ao buscar dados");
        console.error("Erro ao buscar dados: ", error);
      }
    };

    fetchPlotData();  // Chama a função para buscar os dados
  }, []);

  if (plotData.length === 0) {
    return <div>Carregando...</div>;  // Exibe "Carregando..." enquanto os dados não estão prontos
  }

  // Configura os dados para o gráfico de dispersão
  const plotTrace = {
    x: plotData.map((d) => d.x),  // Mapeia os valores de x
    y: plotData.map((d) => d.y),  // Mapeia os valores de y
    mode: 'markers',  // Tipo de gráfico (marcadores para gráfico de dispersão)
    type: 'scatter',  // Tipo de gráfico
  };

  // Retorna o gráfico Plotly
  return (
    <div>
      <Plot
        data={[plotTrace]}  // Dados que serão passados para o gráfico
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
