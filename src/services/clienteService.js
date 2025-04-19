import api from './api';

// Serviço para clientes
export const clienteService = {
  // Listar todos os clientes
  listarTodos: async () => {
    try {
      const response = await api.get('/clientes');
      return response.data;
    } catch (error) {
      console.error('Erro ao listar clientes:', error);
      throw error;
    }
  },

  // Buscar cliente por ID
  buscarPorId: async (id) => {
    try {
      const response = await api.get(`/clientes/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar cliente ${id}:`, error);
      throw error;
    }
  },

  // Buscar cliente por CPF/CNPJ
  buscarPorCpfCnpj: async (cpfCnpj) => {
    try {
      const response = await api.get(`/clientes/cpfcnpj/${cpfCnpj}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar cliente por CPF/CNPJ ${cpfCnpj}:`, error);
      throw error;
    }
  },

  // Cadastrar novo cliente
  cadastrar: async (cliente) => {
    try {
      const response = await api.post('/clientes', cliente);
      return response.data;
    } catch (error) {
      console.error('Erro ao cadastrar cliente:', error);
      throw error;
    }
  },

  // Atualizar cliente existente
  atualizar: async (id, cliente) => {
    try {
      const response = await api.put(`/clientes/${id}`, cliente);
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar cliente ${id}:`, error);
      throw error;
    }
  },

  // Excluir cliente
  excluir: async (id) => {
    try {
      const response = await api.delete(`/clientes/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao excluir cliente ${id}:`, error);
      throw error;
    }
  },
  
  // Listar clientes ativos
  listarAtivos: async () => {
    try {
      const response = await api.get('/clientes/ativos');
      return response.data;
    } catch (error) {
      console.error('Erro ao listar clientes ativos:', error);
      throw error;
    }
  }
};