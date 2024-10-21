import Plot from 'react-plotly.js';

const ViolinPlot = () => {
    const data = [
        {
            type: 'violin',
            y: [1, 2, 3, 4, 5, 6, 7, 8, 9],
            box: { visible: true },
            line: { color: 'purple' },
            meanline: { visible: true },
        },
    ];

    const layout = {
        title: 'Viollin Graph',
        width: 350,
        height: 280,
    };

    return <Plot data={data} layout={layout} />;
};

export default ViolinPlot;
