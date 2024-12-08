export interface ChartProps {
  plotData: {
    variables: string[];
    data: {
      values: number[];
      prices: number[];
      distances: number[];
      total_time: number[];
    };
    id: number;
    zone: number;
    P: number;
    date: string;
    weekDay: number;
    depth_g: number[];
    ED_parallel: {
      values: number;
      prices: number;
      distances: number;
      total_time: number;
    };
    x: number;
    y: number;
  }[] | null;
}
