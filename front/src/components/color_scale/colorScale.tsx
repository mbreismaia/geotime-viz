type ColorScaleKey = 'Month' | 'Weekday';

const discreteColorScales: Record<ColorScaleKey, { colors: string[], labels: string[] }> = {
    Month: {
      colors: [
        '#2e91e5', '#e15f99', '#1ca71c', '#fb0d0d', '#da16ff', 
        '#222a2a', '#b68100', '#750d86', '#eb663b', '#511cfb', 
        '#00a08b', '#fb00d1'
      ],
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    },
    Weekday: {
      colors: ['#636efa', '#ef553b', '#00cc96', '#ab63fa', '#ffa15a', '#19d3f3', '#8c564b'],
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    },
};

export const getColorScale = (method: ColorScaleKey) => discreteColorScales[method] || null;
  
  