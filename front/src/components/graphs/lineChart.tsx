"use client";
import React from "react";
import Plot from "react-plotly.js";

export interface LineChartProps {
  plotData: { 
    variables: string[];
    data: {
      values: number[];
      prices: number[];
      distances: number[];
      total_time: number[];
    };
    id: number;
    zone: number;
    P: number;
    date: string;
    weekDay: number;
  }[] | null; // Agora aceitamos um array de objetos
}

const LineChart = ({ plotData }: LineChartProps) => {
  if (!plotData || plotData.length === 0) {
    console.log("Aguardando dados..."); // Verificando quando os dados não estão presentes
    return <div>Loading...</div>; // Exibe "Loading..." se os dados não estiverem prontos
  }

  console.log("Dados recebidos no LineChart:", plotData); // Verificando os dados recebidos no componente filho

  // Mapeando os dados para criar múltiplos gráficos
  const traces = plotData.map(item => ({
    x: item.data.distances,
    y: item.data.prices,
    type: "scatter",
    mode: "lines",
    line: { color: "blue" },
    name: `ID: ${item.id}`, // Nome do gráfico para identificação
  }));

  console.log("Traces para o gráfico:", traces); // Verificando os traces para múltiplos gráficos

  return (
    <div>
      <h2>Preço vs Distância</h2>
      <Plot
        data={traces} // Passa os múltiplos gráficos
        layout={{
          title: "Preço vs Distância",
          xaxis: { title: "Distância" },
          yaxis: { title: "Preço" },
        }}
      />
    </div>
  );
};

export default LineChart;
