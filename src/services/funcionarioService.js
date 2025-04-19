import api from './api';

// Serviço para funcionários
export const funcionarioService = {
  // Listar todos os funcionários
  listarTodos: async () => {
    try {
      const response = await api.get('/funcionarios');
      return response.data;
    } catch (error) {
      console.error('Erro ao listar funcionários:', error);
      throw error;
    }
  },

  // Buscar funcionário por ID
  buscarPorId: async (id) => {
    try {
      const response = await api.get(`/funcionarios/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar funcionário ${id}:`, error);
      throw error;
    }
  },

  // Buscar funcionário por matrícula
  buscarPorMatricula: async (matricula) => {
    try {
      const response = await api.get(`/funcionarios/matricula/${matricula}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar funcionário por matrícula ${matricula}:`, error);
      throw error;
    }
  },

  // Buscar funcionário por CPF
  buscarPorCpf: async (cpf) => {
    try {
      const response = await api.get(`/funcionarios/cpf/${cpf}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar funcionário por CPF ${cpf}:`, error);
      throw error;
    }
  },

  // Listar funcionários por função
  listarPorFuncao: async (funcao) => {
    try {
      const response = await api.get(`/funcionarios/funcao/${funcao}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao listar funcionários pela função ${funcao}:`, error);
      throw error;
    }
  },

  // Cadastrar novo funcionário
  cadastrar: async (funcionario) => {
    try {
      const response = await api.post('/funcionarios', funcionario);
      return response.data;
    } catch (error) {
      console.error('Erro ao cadastrar funcionário:', error);
      throw error;
    }
  },

  // Atualizar funcionário existente
  atualizar: async (id, funcionario) => {
    try {
      const response = await api.put(`/funcionarios/${id}`, funcionario);
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar funcionário ${id}:`, error);
      throw error;
    }
  },

  // Excluir funcionário
  excluir: async (id) => {
    try {
      const response = await api.delete(`/funcionarios/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao excluir funcionário ${id}:`, error);
      throw error;
    }
  },

  // Autenticar funcionário
  autenticar: async (credenciais) => {
    try {
      const response = await api.post('/auth/login', credenciais);
      return response.data;
    } catch (error) {
      console.error('Erro ao autenticar funcionário:', error);
      throw error;
    }
  },

  // Alterar senha
  alterarSenha: async (id, senhas) => {
    try {
      const response = await api.patch(`/funcionarios/${id}/senha`, senhas);
      return response.data;
    } catch (error) {
      console.error(`Erro ao alterar senha do funcionário ${id}:`, error);
      throw error;
    }
  }
};