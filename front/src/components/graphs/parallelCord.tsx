import Plot from 'react-plotly.js';

const ParallelCoordinatesChart = () => {
    const data = [
        {
            type: 'parcoords',
            line: {
                color: [1, 2, 3, 4],
                colorscale: 'Viridis',
                showscale: true,
            },
            dimensions: [
                {
                    range: [1, 4],
                    constraintrange: [1, 2],
                    label: 'Dimension 1',
                    values: [1, 2, 3, 4],
                },
                {
                    range: [0, 20],
                    constraintrange: [0, 15],
                    label: 'Dimension 2',
                    values: [10, 15, 13, 17],
                },
            ],
        },
    ];

    const layout = {
        title: 'Parallel Coordinates Graph',
        width: 550,
        height: 280,
    };

    return <Plot data={data} layout={layout} />;
};

export default ParallelCoordinatesChart;
