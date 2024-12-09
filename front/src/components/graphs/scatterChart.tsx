import { ChartProps } from "@/types/types";
import Plot from "react-plotly.js";
import { useEffect, useState } from "react";
import { getColorScale } from "@/components/color_scale/colorScale";

const ScatterChart = ({ plotData }: ChartProps) => {
  const [coloringMethod, setColoringMethod] = useState<string | null>(null);
  const [reductionTechnique, setReductionTechnique] = useState<string | null>(null);

  useEffect(() => {
    // Recuperar os parâmetros do localStorage
    const savedParameters = localStorage.getItem("savedParameters");
    if (savedParameters) {
      const parsedParameters = JSON.parse(savedParameters);
      setColoringMethod(parsedParameters.coloring_method || null);
      setReductionTechnique(parsedParameters.dim_reduction_technique || null);
    }
  }, []);

  if (!plotData || plotData.length === 0) {
    return <div>No data available</div>;
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  };

  const colorScaleConfig = getColorScale(coloringMethod as keyof typeof getColorScale);

  const data = [
    {
      x: plotData.map(item => item.x),
      y: plotData.map(item => item.y),
      text: plotData.map(item => `ID: ${item.id}<br>Data: ${formatDate(item.date)}`),
      mode: "markers",
      marker: {
        size: 10,
        color: plotData.map(item => {
          const date = new Date(item.date);
          if (coloringMethod === "Month") {
            return colorScaleConfig.colors[date.getMonth()]; // Mês como índice (0-11)
          } else if (coloringMethod === "Weekday") {
            return colorScaleConfig.colors[date.getDay()]; // Dia da semana como índice (0-6)
          }
          return null; // Cor padrão para casos sem método
        }),
        colorscale: colorScaleConfig?.colors || "Viridis", // Configuração de cores
        showscale: true,
        colorbar: {
          title: coloringMethod || "Color Scale",
          tickvals: colorScaleConfig?.labels.map((_, idx) => idx) || undefined,
          ticktext: colorScaleConfig?.labels || undefined,
        },
      },
      type: "scatter",
    },
  ];

  const layout = {
    title: `Redução de dimensionalidade dos dados utilizando ${reductionTechnique || "Método não especificado"}`,
    xaxis: {
      title: "X",
    },
    yaxis: {
      title: "Y",
    },
    margin: { l: 50, r: 50, b: 50, t: 50 }, // Ajuste de margens para melhor visualização
  };

  return (
    <div>
      <Plot data={data} layout={layout} />
    </div>
  );
};

export default ScatterChart;
