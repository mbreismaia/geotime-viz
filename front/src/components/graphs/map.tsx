import React from 'react';
import Plot from 'react-plotly.js';

const Map = () => {
  const data = [{
    type: 'choroplethmap',
    locations: ['NY', 'MA', 'VT'],
    z: [-50, -10, -20],
    geojson: 'https://raw.githubusercontent.com/python-visualization/folium/master/examples/data/us-states.json',
    zmin: -50,
    zmax: 0,
    colorscale: 'Viridis',
    colorbar: {
      title: 'Value',
    },
  }];

  const layout = {
    map: {
      center: { lon: -74, lat: 43 },
      zoom: 3.5,
    },
    width: 600,
    height: 400,
    geo: {
      scope: 'usa',
      showland: true,
      landcolor: 'white',
      subunitcolor: 'lightgrey',
      countrycolor: 'lightgrey',
    },
  };

  return (
    <Plot
      data={data}
      layout={layout}
    />
  );
};

export default Map;
