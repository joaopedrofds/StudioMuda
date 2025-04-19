import axios from 'axios';
import config from '../config';
import { toast } from 'react-toastify';

// Cria uma instância do axios com configurações base
const api = axios.create({
  baseURL: config.apiUrl, // URL da API Java configurada centralmente
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Interceptador para adicionar token de autenticação a todas as requisições
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Erro ao preparar requisição:', error);
    return Promise.reject(error);
  }
);

// Interceptador para tratar erros de resposta
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Criar mensagens de erro mais amigáveis baseadas no tipo de erro
    if (error.code === 'ECONNABORTED') {
      toast.error('A requisição demorou muito para responder. Verifique sua conexão.');
    } else if (!error.response) {
      toast.error('Não foi possível conectar ao servidor. Verifique sua conexão de internet.');
    } else {
      const status = error.response.status;
      
      // Tratamento específico por código de status
      if (status === 401) {
        // Não autorizado - limpar dados locais e redirecionar para login
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        toast.error('Sua sessão expirou. Por favor, faça login novamente.');
        window.location.href = '/login';
      } else if (status === 403) {
        toast.error('Você não tem permissão para realizar esta ação.');
      } else if (status === 404) {
        toast.error('O recurso solicitado não foi encontrado.');
      } else if (status === 500) {
        toast.error('Erro no servidor. Por favor, tente novamente mais tarde.');
      } else {
        // Mensagem personalizada da API ou mensagem genérica
        const errorMessage = error.response?.data?.message || 'Ocorreu um erro inesperado.';
        toast.error(errorMessage);
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;