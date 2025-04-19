import api from './api';

// Serviço para produtos
export const produtoService = {
  // Listar todos os produtos
  listarTodos: async () => {
    try {
      const response = await api.get('/produtos');
      return response.data;
    } catch (error) {
      console.error('Erro ao listar produtos:', error);
      throw error;
    }
  },

  // Buscar produto por ID
  buscarPorId: async (id) => {
    try {
      const response = await api.get(`/produtos/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar produto ${id}:`, error);
      throw error;
    }
  },

  // Cadastrar novo produto
  cadastrar: async (produto) => {
    try {
      const response = await api.post('/produtos', produto);
      return response.data;
    } catch (error) {
      console.error('Erro ao cadastrar produto:', error);
      throw error;
    }
  },

  // Atualizar produto existente
  atualizar: async (id, produto) => {
    try {
      const response = await api.put(`/produtos/${id}`, produto);
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar produto ${id}:`, error);
      throw error;
    }
  },

  // Excluir produto
  excluir: async (id) => {
    try {
      const response = await api.delete(`/produtos/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao excluir produto ${id}:`, error);
      throw error;
    }
  },
  
  // Listar produtos por tipo
  listarPorTipo: async (tipo) => {
    try {
      const response = await api.get(`/produtos/tipo/${tipo}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao listar produtos do tipo ${tipo}:`, error);
      throw error;
    }
  },
  
  // Listar produtos com estoque disponível
  listarComEstoqueDisponivel: async () => {
    try {
      const response = await api.get('/produtos/com-estoque');
      return response.data;
    } catch (error) {
      console.error('Erro ao listar produtos com estoque disponível:', error);
      throw error;
    }
  }
};