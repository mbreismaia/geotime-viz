import { GraphData } from '@/types/graphData';
import axios from 'axios';

// A baseURL será obtida da variável de ambiente
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,  
});

export const fetchPlotData = async (plotType: string, params: any): Promise<GraphData[]> => {
  const response = await api.get(`/${plotType}_plot`, { params });
  return response.data;
};
