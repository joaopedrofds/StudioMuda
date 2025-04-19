import React, { createContext, useState, useEffect } from "react";
import api from "../services/api";
import { toast } from "react-toastify";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const recuperarUsuario = async () => {
      setLoading(true);
      // Verificar se existe um usuário de teste
      const testUser = localStorage.getItem("testUser");
      if (testUser === "true") {
        // Usar o super user para testes
        const superUser = {
          id: 1,
          nome: "Admin Teste",
          email: "admin@studiomuda.com",
          funcao: "ADMINISTRADOR",
          matricula: "ADMIN123",
          permissoes: ["admin", "gerente", "vendedor", "estoquista"],
          ativo: true
        };
        setUser(superUser);
        setLoading(false);
        return;
      }

      try {
        const token = localStorage.getItem("token");
        if (token) {
          // Verificar se o token é válido
          try {
            const response = await api.get("/auth/validar");
            setUser(response.data);
          } catch (tokenError) {
            console.error("Token inválido:", tokenError);
            // Se o token for inválido, limpa o localStorage
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            toast.error("Sessão expirada, faça login novamente");
          }
        }
      } catch (error) {
        console.error("Erro ao recuperar usuário:", error);
        // Se o token for inválido, limpa o localStorage
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      } finally {
        setLoading(false);
      }
    };

    recuperarUsuario();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    setError(null);

    if (!email || !password) {
      setError("Email e senha são obrigatórios");
      setLoading(false);
      return false;
    }

    // Para testes: verificar se está tentando fazer login como super user
    if (email === "admin@studiomuda.com" && password === "admin123") {
      const superUser = {
        id: 1,
        nome: "Admin Teste",
        email: "admin@studiomuda.com",
        funcao: "ADMINISTRADOR",
        matricula: "ADMIN123",
        permissoes: ["admin", "gerente", "vendedor", "estoquista"],
        ativo: true
      };
      
      // Armazenar flag para identificar que é um usuário de teste
      localStorage.setItem("testUser", "true");
      localStorage.setItem("user", JSON.stringify(superUser));
      
      setUser(superUser);
      setLoading(false);
      toast.success("Login realizado com sucesso!");
      return true;
    }

    try {
      const response = await api.post("/auth/login", { email, password });
      const { token, user: userData } = response.data;
      
      // Armazenar token e dados do usuário
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(userData));
      
      setUser(userData);
      toast.success("Login realizado com sucesso!");
      return true;
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      const errorMessage = error.response?.data?.message || "Credenciais inválidas. Tente novamente.";
      setError(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post("/auth/register", userData);
      const { token, user: newUser } = response.data;
      
      // Armazenar token e dados do usuário
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(newUser));
      
      setUser(newUser);
      toast.success("Registro realizado com sucesso!");
      return true;
    } catch (error) {
      console.error("Erro ao registrar usuário:", error);
      const errorMessage = error.response?.data?.message || "Não foi possível criar a conta. Tente novamente.";
      setError(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    // Verificar se é o usuário de teste
    if (localStorage.getItem("testUser") === "true") {
      localStorage.removeItem("testUser");
      localStorage.removeItem("user");
      setUser(null);
      toast.info("Você saiu do sistema");
      return;
    }

    try {
      // Opcional: notificar o backend sobre o logout
      await api.post("/auth/logout");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    } finally {
      // Mesmo se falhar no backend, limpa os dados locais
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
      toast.info("Você saiu do sistema");
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
}
