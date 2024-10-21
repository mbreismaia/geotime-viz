import Plot from 'react-plotly.js';

const TSNEChart = () => {
    const data = [
        {
            x: [-10, -5, 0, 5, 10, 15], // Valores fictícios para eixo x
            y: [-15, -10, -5, 0, 5, 10], // Valores fictícios para eixo y
            mode: 'markers',
            marker: { size: 12, color: 'blue', symbol: 'circle' },
            type: 'scatter',
            name: 'Dados',
        },
    ];

    const layout = {
        title: 't-distributed Stochastic Neighbor Embedding',
        xaxis: { title: 'X - Time' },
        yaxis: { title: 'Y - Value' },
        width: 350,
        height: 280,
    };

    return <Plot data={data} layout={layout} />;
};

export default TSNEChart;
