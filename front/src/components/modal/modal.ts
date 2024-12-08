export const defaultParameters = {
  plot: "line",
  runED: true,
  variables: ["values", "prices", "distances", "total_time"], // Variáveis fixas
  hour_interval: [0, 23] as [number, number],
  date_interval: null as [string, string] | null,
  coloring_method: "",
  depth_type: "",
  dim_reduction_technique: "",
  reference_point: "",
  days_of_week: [] as string[],
};

export const weekDay = [
  { key: "Monday", label: "Monday" },
  { key: "Tuesday", label: "Tuesday" },
  { key: "Wednesday", label: "Wednesday" },
  { key: "Thursday", label: "Thursday" },
  { key: "Friday", label: "Friday" },
  { key: "Saturday", label: "Saturday" },
  { key: "Sunday", label: "Sunday" },
];

export const depth_type = [
  { key: "L2", label: "L2" },
  { key: "Spatial", label: "Spatial" },
];


export const coloring_method = [
  { key: "Month", label: "Month" },
  { key: "Quarter", label: "Quarter" },
];

export const dim_reduction_technique = [
  { key: "t-SNE", label: "t-SNE" },
  { key: "UMAP", label: "UMAP" },
];

export const reference_point = [
  { key: "Origin", label: "Origin" },
  { key: "Destination", label: "Destination" },
];
