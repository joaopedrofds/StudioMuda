import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FiMenu, FiX, FiHome, FiUser, FiUsers, FiShoppingCart, 
        FiPackage, FiCheckSquare, FiDatabase, FiLogOut, FiWifi, FiWifiOff } from 'react-icons/fi';
import logoStudioMuda from "../assets/Logo Insta Branca.png";
import api from '../services/api';
import { toast } from 'react-toastify';

const MainLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [backendStatus, setBackendStatus] = useState('desconhecido'); // 'online', 'offline', 'desconhecido'
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkBackendStatus = async () => {
      // Se estamos usando o modo de teste, não precisamos verificar o backend
      if (localStorage.getItem("testUser") === "true") {
        setBackendStatus('teste');
        return;
      }

      try {
        // Tenta fazer uma requisição simples para verificar se o backend está online
        await api.get('/healthcheck', { timeout: 3000 });
        setBackendStatus('online');
      } catch (error) {
        console.log('Backend não está acessível:', error);
        setBackendStatus('offline');
      }
    };

    checkBackendStatus();
    
    // Verifica o status do backend a cada 60 segundos
    const interval = setInterval(checkBackendStatus, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = async () => {
    await logout();
    toast.info("Você saiu do sistema com sucesso");
    navigate('/login');
  };

  // Determina se um link está ativo
  const isActiveLink = (path) => {
    return location.pathname === path;
  };

  // Renderiza o ícone de status do backend
  const renderBackendStatus = () => {
    if (backendStatus === 'online') {
      return (
        <div className="flex items-center text-green-600 bg-green-100 px-2 py-1 rounded-md">
          <FiWifi className="mr-1" />
          <span className="text-xs">Conectado</span>
        </div>
      );
    } else if (backendStatus === 'offline') {
      return (
        <div className="flex items-center text-red-600 bg-red-100 px-2 py-1 rounded-md">
          <FiWifiOff className="mr-1" />
          <span className="text-xs">Offline</span>
        </div>
      );
    } else if (backendStatus === 'teste') {
      return (
        <div className="flex items-center text-blue-600 bg-blue-100 px-2 py-1 rounded-md">
          <FiWifi className="mr-1" />
          <span className="text-xs">Demo</span>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar para telas maiores */}
      <div className={`bg-gray-800 text-white w-64 space-y-6 py-7 px-2 absolute inset-y-0 left-0 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition duration-200 ease-in-out z-30`}>
        <div className="flex flex-col items-center justify-between px-4">
          <img src={logoStudioMuda} alt="StudioMuda Logo" className="h-12 mb-2" />
          <h2 className="text-xl font-semibold text-white">Studio Muda</h2>
          <button className="md:hidden absolute top-4 right-4" onClick={() => setSidebarOpen(false)}>
            <FiX className="h-6 w-6" />
          </button>
        </div>
        
        <nav className="mt-10">
          <Link 
            to="/home" 
            className={`flex items-center py-2 px-4 ${isActiveLink('/home') ? 'bg-green-600 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'} rounded`}
          >
            <FiHome className="mr-3 h-5 w-5" />
            Início
          </Link>
          <Link 
            to="/cadastro-funcionario" 
            className={`flex items-center py-2 px-4 ${isActiveLink('/cadastro-funcionario') ? 'bg-green-600 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'} rounded`}
          >
            <FiUser className="mr-3 h-5 w-5" />
            Cadastro Funcionário
          </Link>
          <Link 
            to="/cadastro-cliente" 
            className={`flex items-center py-2 px-4 ${isActiveLink('/cadastro-cliente') ? 'bg-green-600 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'} rounded`}
          >
            <FiUsers className="mr-3 h-5 w-5" />
            Cadastro Cliente
          </Link>
          <Link 
            to="/pedido-venda" 
            className={`flex items-center py-2 px-4 ${isActiveLink('/pedido-venda') ? 'bg-green-600 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'} rounded`}
          >
            <FiShoppingCart className="mr-3 h-5 w-5" />
            Pedido Venda
          </Link>
          <Link 
            to="/solicitacao-retirada" 
            className={`flex items-center py-2 px-4 ${isActiveLink('/solicitacao-retirada') ? 'bg-green-600 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'} rounded`}
          >
            <FiPackage className="mr-3 h-5 w-5" />
            Solicitação Retirada
          </Link>
          <Link 
            to="/aprovacao-retirada" 
            className={`flex items-center py-2 px-4 ${isActiveLink('/aprovacao-retirada') ? 'bg-green-600 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'} rounded`}
          >
            <FiCheckSquare className="mr-3 h-5 w-5" />
            Aprovação Retirada
          </Link>
          <Link 
            to="/controle-estoque" 
            className={`flex items-center py-2 px-4 ${isActiveLink('/controle-estoque') ? 'bg-green-600 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'} rounded`}
          >
            <FiDatabase className="mr-3 h-5 w-5" />
            Controle Estoque
          </Link>
          <button 
            onClick={handleLogout}
            className="flex items-center w-full py-2 px-4 text-gray-300 hover:bg-gray-700 hover:text-white rounded mt-10"
          >
            <FiLogOut className="mr-3 h-5 w-5" />
            Sair
          </button>
        </nav>
        
        {/* Informação de status na parte inferior do menu */}
        <div className="mt-auto pt-6 px-4">
          <div className="text-sm text-gray-400 mb-2">Status do sistema:</div>
          {renderBackendStatus()}
        </div>
      </div>

      {/* Conteúdo principal */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Cabeçalho */}
        <header className="bg-white shadow-md py-4 px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button className="md:hidden mr-4" onClick={() => setSidebarOpen(true)}>
                <FiMenu className="h-6 w-6" />
              </button>
              <h1 className="text-xl font-semibold text-gray-800">
                {location.pathname === '/home' && 'Dashboard'}
                {location.pathname === '/cadastro-funcionario' && 'Cadastro de Funcionários'}
                {location.pathname === '/cadastro-cliente' && 'Cadastro de Clientes'}
                {location.pathname === '/pedido-venda' && 'Pedidos de Venda'}
                {location.pathname === '/solicitacao-retirada' && 'Solicitação de Retirada'}
                {location.pathname === '/aprovacao-retirada' && 'Aprovação de Retirada'}
                {location.pathname === '/controle-estoque' && 'Controle de Estoque'}
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              {renderBackendStatus()}
              <div className="text-sm font-medium text-gray-700 bg-gray-100 px-3 py-1 rounded-full">
                {user?.nome || user?.email || 'Usuário'}
              </div>
            </div>
          </div>
        </header>

        {/* Área de conteúdo principal */}
        <main className="flex-1 overflow-y-auto bg-gray-100 p-4">
          {children}
        </main>

        {/* Rodapé */}
        <footer className="bg-white shadow-md py-3 px-4 text-center text-sm text-gray-600">
          © {new Date().getFullYear()} StudioMuda - Todos os direitos reservados
        </footer>
      </div>
    </div>
  );
};

export default MainLayout;