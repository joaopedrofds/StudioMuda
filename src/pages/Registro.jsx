import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import Loading from "../components/Loading";
import { toast } from "react-toastify";
import { FiUserPlus, FiLogIn, FiAlertCircle } from "react-icons/fi";
import logoStudioMuda from "../assets/Logo Insta Branca.png";

function Registro() {
  const { register, loading, error: authError } = useContext(AuthContext);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    
    // Validação de campos
    if (!nome.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      setError("Todos os campos são obrigatórios.");
      return;
    }
    
    // Validação de senha
    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }
    
    if (password.length < 6) {
      setError("A senha deve ter no mínimo 6 caracteres.");
      return;
    }

    // Validação de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Por favor, insira um email válido.");
      return;
    }
    
    const userData = {
      nome,
      email,
      password
    };
    
    try {
      const success = await register(userData);
      
      if (success) {
        navigate("/home");
      } else {
        setError(authError || "Não foi possível criar a conta. Tente novamente.");
      }
    } catch (err) {
      setError("Erro ao processar seu registro. Por favor, tente novamente.");
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
            Crie sua conta para acessar o sistema
          </p>
          
          <div className="w-full mt-4 p-3 bg-blue-50 rounded-md text-sm text-blue-800">
            <div className="flex items-start">
              <FiAlertCircle className="flex-shrink-0 mr-2 mt-0.5" />
              <div>
                <p className="font-medium">Nota:</p>
                <p>Durante testes, recomendamos fazer login com o usuário admin existente em vez de criar novo usuário:</p>
                <p className="mt-1">Email: <strong>admin@studiomuda.com</strong></p>
                <p>Senha: <strong>admin123</strong></p>
              </div>
            </div>
          </div>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="nome" className="sr-only">Nome</label>
              <input
                id="nome"
                name="nome"
                type="text"
                required
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                placeholder="Nome completo"
              />
            </div>
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
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                placeholder="Email"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Senha</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                placeholder="Senha"
              />
            </div>
            <div>
              <label htmlFor="confirm-password" className="sr-only">Confirmar Senha</label>
              <input
                id="confirm-password"
                name="confirm-password"
                type="password"
                autoComplete="new-password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                placeholder="Confirmar senha"
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
                <FiUserPlus className="h-5 w-5 text-green-500 group-hover:text-green-400" />
              </span>
              Registrar
            </button>
          </div>
          
          <div className="text-sm text-center">
            <Link to="/login" className="font-medium text-green-600 hover:text-green-500 flex items-center justify-center">
              <FiLogIn className="mr-1" /> Já tem uma conta? Faça login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Registro;
