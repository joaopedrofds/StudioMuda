// Configurações globais do sistema
const config = {
  // URL base da API (backend)
  apiUrl: 'http://localhost:8080/StudioMuda/api',
  
  // Credenciais para modo de teste
  testCredentials: {
    email: 'admin@studiomuda.com',
    password: 'admin123'
  },
  
  // Configurações do Toast
  toast: {
    position: 'top-right',
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true
  },
  
  // Outras configurações
  defaultPageSize: 10,
  debounceTime: 500, // tempo em ms para debounce de buscas
  
  // Erros e mensagens do sistema
  messages: {
    connectionError: 'Não foi possível conectar ao servidor. Verifique sua conexão ou use as credenciais de teste.',
    loginSuccess: 'Login realizado com sucesso!',
    logoutSuccess: 'Logout realizado com sucesso!',
    requiredFields: 'Todos os campos são obrigatórios.',
    passwordMismatch: 'As senhas não coincidem.',
    invalidCredentials: 'Credenciais inválidas. Tente novamente.',
    serverError: 'Erro no servidor. Por favor, tente novamente mais tarde.'
  }
};

export default config;