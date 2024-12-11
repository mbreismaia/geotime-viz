import axios from 'axios';

// A baseURL será obtida da variável de ambiente
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,  
});

// Função para testar a conexão
export const testConnection = async () => {
  try {
    const response = await api.get("/test/test-connection");  // URL completa
    // console.log("Conexão realizada com sucesso!");
    return response.data;
  } catch (error) {
    // console.log("API não conectada!");
    return null;
  }
};

