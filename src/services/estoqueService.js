import api from './api';

// Serviço para controle de estoque
export const estoqueService = {
  // Obter a situação atual do estoque
  obterSituacaoAtual: async () => {
    try {
      const response = await api.get('/estoque');
      return response.data;
    } catch (error) {
      console.error('Erro ao obter situação do estoque:', error);
      throw error;
    }
  },
  
  // Obter produtos com estoque baixo
  obterEstoqueBaixo: async () => {
    try {
      const response = await api.get('/estoque/baixo');
      return response.data;
    } catch (error) {
      console.error('Erro ao obter produtos com estoque baixo:', error);
      throw error;
    }
  },
  
  // Obter estoque de um produto específico
  obterEstoqueProduto: async (produtoId) => {
    try {
      const response = await api.get(`/estoque/produto/${produtoId}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao obter estoque do produto ${produtoId}:`, error);
      throw error;
    }
  },
  
  // Registrar entrada de estoque
  registrarEntrada: async (dados) => {
    try {
      const response = await api.post('/estoque/entrada', dados);
      return response.data;
    } catch (error) {
      console.error('Erro ao registrar entrada no estoque:', error);
      throw error;
    }
  },
  
  // Registrar saída de estoque
  registrarSaida: async (dados) => {
    try {
      const response = await api.post('/estoque/saida', dados);
      return response.data;
    } catch (error) {
      console.error('Erro ao registrar saída do estoque:', error);
      throw error;
    }
  },
  
  // Obter histórico de movimentações
  obterHistoricoMovimentacoes: async (filtros) => {
    try {
      const response = await api.get('/estoque/movimentacoes', { params: filtros });
      return response.data;
    } catch (error) {
      console.error('Erro ao obter histórico de movimentações:', error);
      throw error;
    }
  },
  
  // Atualizar estoque mínimo
  atualizarEstoqueMinimo: async (produtoId, estoqueMinimo) => {
    try {
      const response = await api.patch(`/estoque/produto/${produtoId}/minimo`, { estoqueMinimo });
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar estoque mínimo do produto ${produtoId}:`, error);
      throw error;
    }
  },
  
  // Solicitar retirada de produto
  solicitarRetirada: async (solicitacao) => {
    try {
      const response = await api.post('/estoque/solicitacao', solicitacao);
      return response.data;
    } catch (error) {
      console.error('Erro ao solicitar retirada de produto:', error);
      throw error;
    }
  },
  
  // Listar solicitações pendentes
  listarSolicitacoesPendentes: async () => {
    try {
      const response = await api.get('/estoque/solicitacoes/pendentes');
      return response.data;
    } catch (error) {
      console.error('Erro ao listar solicitações pendentes:', error);
      throw error;
    }
  },
  
  // Aprovar solicitação de retirada
  aprovarSolicitacao: async (solicitacaoId) => {
    try {
      const response = await api.patch(`/estoque/solicitacoes/${solicitacaoId}/aprovar`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao aprovar solicitação ${solicitacaoId}:`, error);
      throw error;
    }
  },
  
  // Rejeitar solicitação de retirada
  rejeitarSolicitacao: async (solicitacaoId, motivo) => {
    try {
      const response = await api.patch(`/estoque/solicitacoes/${solicitacaoId}/rejeitar`, { motivo });
      return response.data;
    } catch (error) {
      console.error(`Erro ao rejeitar solicitação ${solicitacaoId}:`, error);
      throw error;
    }
  }
};