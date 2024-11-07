"use client"
import PlotComponent from "./teste";

export default function HomePage() {
  const params = {
    plot: "scatter",
    runED: true,
    variables: ["values", "prices"],
    hour_interval: [0, 23],
    date_interval: ["2024-01-01", "2024-12-31"],
    coloring_method: "default",
    depth_type: "L2",
    dim_reduction_technique: "UMAP",
    reference_point: "origin",
    days_of_week: ["Monday", "Tuesday"]
  };

  return <PlotComponent plotType="scatter" params={params} />;
}
