"use client";
import React, { useState } from "react";
import Plot from "react-plotly.js";
import { LineChartProps } from "../dashboard";

const LineChart = ({ plotData }: LineChartProps) => {
  const [selectedDates, setSelectedDates] = useState<string[]>([]);

  if (!plotData || plotData.length === 0) {
    console.log("Aguardando dados...");
    return <div>Loading...</div>;
  }

  const traces = plotData
    .filter(item => selectedDates.length === 0 || selectedDates.includes(item.date)) // Filtrar pelas datas selecionadas
    .map(item => ({
      x: Array.from({ length: item.data.distances.length }, (_, i) => `${i}:00`), // Criando as horas
      y: item.data.distances, // Distâncias como Y
      type: "scatter",
      mode: "lines",
      line: { shape: "spline" }, // Linhas suaves
      name: item.date, // Nome baseado na data
    }));

  // Função para lidar com seleção de datas
  const handleDateSelection = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(
      event.target.selectedOptions,
      option => option.value
    );
    setSelectedDates(selectedOptions);
  };

  return (
    <div className="flex">     
      <div className="flex flex-col">
        <label htmlFor="date-select">Selecione as Datas:</label>
        <select
          id="date-select"
          multiple
          onChange={handleDateSelection}
          style={{ width: "100%", height: "100px", marginTop: "10px" }}
        >
          {plotData.map(item => (
            <option key={item.date} value={item.date}>
              {item.date}
            </option>
          ))}
        </select>
      </div>

      {/* Gráfico */}
      <Plot
        data={traces}
        layout={{
          title: "Distâncias ao Longo do Tempo",
          xaxis: { title: "Horas" },
          yaxis: { title: "Distâncias" },
          showlegend: true,
          width: 400, // Largura em pixels
          height: 300, // Altura em pixels
          autosize: true, // Ajusta automaticamente, se necessário
        }}
        style={{ width: "100%", height: "100%" }} // Ajusta ao tamanho do contêiner
      />
    </div>
  );
};

export default LineChart;
