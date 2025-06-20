export interface ChartProps {
  plotData: {
    variables: string[];
    id: number;
    zone: number;
    zone_name: string;
    P: number;
    date: string;
    weekDay: number;
    depth_g: number[];
    x: number;
    y: number;
    extremal_depth: number;
    phi: number[];
    data: Record<string, number[]>;
    ED_parallel: Record<string, number>;
    phi_parallel: Record<string, number[]>;
    depth_g_parallel: Record<string, number[]>;

  }[] | null;
}

