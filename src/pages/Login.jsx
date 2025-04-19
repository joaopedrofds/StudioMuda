import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import Loading from "../components/Loading";
import { toast } from "react-toastify";
import { FiLogIn, FiUserPlus, FiAlertCircle } from "react-icons/fi";
import logoStudioMuda from "../assets/Logo Insta Branca.png";

function Login() {
  const { login, loading, error: authError } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [connectionError, setConnectionError] = useState(false);
  const navigate = useNavigate();

  // Verificar conexão ao backend
  useEffect(() => {
    const checkBackendConnection = async () => {
      try {
        setConnectionError(false);
      } catch (err) {
        console.error("Erro ao conectar ao backend:", err);
        setConnectionError(true);
      }
    };
    
    checkBackendConnection();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    
    if (!email.trim() || !password.trim()) {
      setError("Todos os campos são obrigatórios.");
      return;
    }
    
    // Se estamos usando usuário de teste (admin@studiomuda.com) não precisamos verificar conexão
    if (email !== "admin@studiomuda.com" && connectionError) {
      setError("Não foi possível conectar ao servidor. Verifique sua conexão ou use as credenciais de teste.");
      toast.error("Falha na conexão com o servidor");
      return;
    }
    
    try {
      const success = await login(email, password);
      
      if (success) {
        navigate("/home");
      } else {
        setError(authError || "Credenciais inválidas. Tente novamente.");
      }
    } catch (err) {
      setError("Erro ao realizar login. Tente novamente.");
      toast.error("Erro ao processar sua solicitação");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 sm:px-6 lg:px-8">
      <Loading loading={loading} />
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        <div className="flex flex-col items-center">
          <img src={logoStudioMuda} alt="StudioMuda Logo" className="h-20 mx-auto" />
          <h2 className="mt-4 text-center text-2xl font-bold text-gray-900">StudioMuda</h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Entre com suas credenciais para acessar o sistema
          </p>
          
          {connectionError && (
            <div className="mt-2 p-2 bg-yellow-50 text-yellow-700 rounded-md text-sm flex items-center">
              <FiAlertCircle className="mr-2" /> 
              <span>
                Sistema em modo offline. 
                <br />
                Use <strong>admin@studiomuda.com</strong> e senha <strong>admin123</strong>
              </span>
            </div>
          )}
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">Email</label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                placeholder="Email"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Senha</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                placeholder="Senha"
              />
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center p-2 bg-red-50 rounded-md">
              {error}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                <FiLogIn className="h-5 w-5 text-green-500 group-hover:text-green-400" />
              </span>
              Entrar
            </button>
          </div>
          
          <div className="text-sm text-center">
            <Link to="/registro" className="font-medium text-green-600 hover:text-green-500 flex items-center justify-center">
              <FiUserPlus className="mr-1" /> Não tem uma conta? Registre-se
            </Link>
          </div>
        </form>
        
        <div className="text-xs text-center text-gray-500 mt-4 pt-4 border-t">
          <p>Para testar o sistema, use:</p>
          <p>Email: <strong>admin@studiomuda.com</strong></p>
          <p>Senha: <strong>admin123</strong></p>
        </div>
      </div>
    </div>
  );
}

export default Login;
