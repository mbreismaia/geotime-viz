import Plot from 'react-plotly.js';

const LineChart = () => {
    const data = [
        {
            x: [1, 2, 3, 4],
            y: [10, 15, 13, 17],
            type: 'scatter',
            mode: 'lines+markers',
            marker: { color: 'red' },
        },
    ];

    const layout = {
        title: 'Gráfico de Linhas',
        width: 500, 
        height: 200, 
    };

    return <Plot data={data} layout={layout} />;
};

export default LineChart;
