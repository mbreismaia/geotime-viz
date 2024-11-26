export interface LineChartProps {
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
  }[] | null;
}
