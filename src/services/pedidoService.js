import api from './api';

// Serviço para pedidos
export const pedidoService = {
  // Listar todos os pedidos
  listarTodos: async () => {
    try {
      const response = await api.get('/pedidos');
      return response.data;
    } catch (error) {
      console.error('Erro ao listar pedidos:', error);
      throw error;
    }
  },

  // Buscar pedido por ID
  buscarPorId: async (id) => {
    try {
      const response = await api.get(`/pedidos/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar pedido ${id}:`, error);
      throw error;
    }
  },

  // Listar pedidos por cliente
  listarPorCliente: async (clienteId) => {
    try {
      const response = await api.get(`/pedidos/cliente/${clienteId}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao listar pedidos do cliente ${clienteId}:`, error);
      throw error;
    }
  },

  // Listar pedidos por período
  listarPorPeriodo: async (dataInicio, dataFim) => {
    try {
      const response = await api.get(`/pedidos/periodo?inicio=${dataInicio}&fim=${dataFim}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao listar pedidos no período de ${dataInicio} a ${dataFim}:`, error);
      throw error;
    }
  },

  // Listar pedidos por status
  listarPorStatus: async (status) => {
    try {
      const response = await api.get(`/pedidos/status/${status}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao listar pedidos com status ${status}:`, error);
      throw error;
    }
  },

  // Cadastrar novo pedido
  cadastrar: async (pedido) => {
    try {
      const response = await api.post('/pedidos', pedido);
      return response.data;
    } catch (error) {
      console.error('Erro ao cadastrar pedido:', error);
      throw error;
    }
  },

  // Atualizar status do pedido
  atualizarStatus: async (id, novoStatus) => {
    try {
      const response = await api.patch(`/pedidos/${id}/status`, { status: novoStatus });
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar status do pedido ${id}:`, error);
      throw error;
    }
  },

  // Cancelar pedido
  cancelar: async (id, motivo) => {
    try {
      const response = await api.patch(`/pedidos/${id}/cancelar`, { motivo: motivo });
      return response.data;
    } catch (error) {
      console.error(`Erro ao cancelar pedido ${id}:`, error);
      throw error;
    }
  },

  // Adicionar item ao pedido
  adicionarItem: async (pedidoId, item) => {
    try {
      const response = await api.post(`/pedidos/${pedidoId}/itens`, item);
      return response.data;
    } catch (error) {
      console.error(`Erro ao adicionar item ao pedido ${pedidoId}:`, error);
      throw error;
    }
  },

  // Remover item do pedido
  removerItem: async (pedidoId, itemId) => {
    try {
      const response = await api.delete(`/pedidos/${pedidoId}/itens/${itemId}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao remover item ${itemId} do pedido ${pedidoId}:`, error);
      throw error;
    }
  }
};