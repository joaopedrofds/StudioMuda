import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom"; 
import Home from "../pages/Home";
import CadastroFuncionario from "../pages/CadastroFuncionario";
import CadastroCliente from "../pages/CadastroCliente";
import PedidoVenda from "../pages/PedidoVenda";
import SolicitacaoRetirada from "../pages/SolicitacaoRetirada";
import AprovacaoRetirada from "../pages/AprovacaoRetirada";
import ControleEstoque from "../pages/ControleEstoque";
import Login from "../pages/Login";
import Registro from "../pages/Registro";
import ErrorBanner from "../components/ErrorBanner";
import { toast } from "react-toastify";

function AppRoutes() {
  const { user, loading } = useContext(AuthContext);
  const [connectionError, setConnectionError] = useState(false);
  const navigate = useNavigate();

  // Verificar se o usuário está carregando ou se há algum problema de conexão
  useEffect(() => {
    // Se o usuário não estiver logado e não estiver carregando, 
    // exibe mensagem instrutiva para usar as credenciais de teste
    if (!user && !loading) {
      toast.info("Use email: admin@studiomuda.com e senha: admin123 para testar o sistema", {
        toastId: "login-hint",
        autoClose: 10000
      });
    }
  }, [user, loading]);

  // Tentativa reconexão quando houver erro de conexão
  const handleRetryConnection = () => {
    setConnectionError(false);
    window.location.reload();
  };

  // Definir rotas protegidas - redirecionam para login se não autenticado
  const ProtectedRoute = ({ element }) => {
    if (loading) return <div className="flex items-center justify-center h-screen">Carregando...</div>;
    return user ? element : <Navigate to="/login" replace />;
  };

  return (
    <>
      {connectionError && (
        <div className="fixed top-0 left-0 right-0 z-50 p-4">
          <ErrorBanner
            isVisible={true}
            errorType="connection"
            message="Não foi possível conectar ao servidor. Verifique sua conexão de internet ou se o servidor está em execução."
            onRetry={handleRetryConnection}
          />
        </div>
      )}
      
      <Routes>
        {user ? (
          // Rotas protegidas - usuário autenticado
          <>
            <Route path="/" element={<Navigate to="/home" />} />
            <Route path="/home" element={<Home />} />
            <Route path="/cadastro-funcionario" element={<CadastroFuncionario />} />
            <Route path="/cadastro-cliente" element={<CadastroCliente />} />
            <Route path="/pedido-venda" element={<PedidoVenda />} />
            <Route path="/solicitacao-retirada" element={<SolicitacaoRetirada />} />
            <Route path="/aprovacao-retirada" element={<AprovacaoRetirada />} />
            <Route path="/controle-estoque" element={<ControleEstoque />} />
            {/* Redirecionar página não encontrada para home */}
            <Route path="*" element={<Navigate to="/home" />} />
          </>
        ) : (
          // Rotas públicas - usuário não autenticado
          <>
            <Route path="/login" element={<Login />} />
            <Route path="/registro" element={<Registro />} />
            {/* Redirecionar qualquer outra rota para login */}
            <Route path="*" element={<Navigate to="/login" />} />
          </>
        )}
      </Routes>
    </>
  );
}

export default AppRoutes;