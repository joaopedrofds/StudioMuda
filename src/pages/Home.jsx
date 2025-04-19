import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import MainLayout from "../components/MainLayout";
import { FiUsers, FiPackage, FiDollarSign, FiAlertCircle, FiShoppingCart, FiInfo, FiCheckCircle } from "react-icons/fi";
import { clienteService } from "../services/clienteService";
import { produtoService } from "../services/produtoService";
import { pedidoService } from "../services/pedidoService";
import { estoqueService } from "../services/estoqueService";
import Loading from "../components/Loading";
import { toast } from "react-toastify";
import logoVasoPreta from "../assets/Logo Vaso Preta.png";

function Home() {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [showTestInfo, setShowTestInfo] = useState(true);
  const [stats, setStats] = useState({
    totalClientes: 0,
    totalProdutos: 0,
    totalPedidosMes: 0,
    produtosBaixoEstoque: 0,
    vendasRecentes: []
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        setTimeout(() => {
          setStats({
            totalClientes: 120,
            totalProdutos: 75,
            totalPedidosMes: 42,
            produtosBaixoEstoque: 8,
            vendasRecentes: [
              { id: 1, cliente: "Empresa ABC", data: "15/04/2025", valor: "R$ 2.500,00", status: "Concluído" },
              { id: 2, cliente: "Construtora XYZ", data: "14/04/2025", valor: "R$ 4.750,00", status: "Pendente" },
              { id: 3, cliente: "Arquitetura Design", data: "12/04/2025", valor: "R$ 1.890,00", status: "Concluído" },
              { id: 4, cliente: "Incorporadora Vista", data: "10/04/2025", valor: "R$ 3.200,00", status: "Concluído" },
              { id: 5, cliente: "Casa & Design", data: "08/04/2025", valor: "R$ 980,00", status: "Cancelado" }
            ]
          });
          setLoading(false);
          
          // Mostrar mensagem de boas-vindas apenas na primeira vez
          const testUserWelcomed = localStorage.getItem("testUserWelcomed");
          if (!testUserWelcomed && localStorage.getItem("testUser") === "true") {
            toast.success("Bem-vindo ao modo de demonstração do Studio Muda!", {
              autoClose: 8000
            });
            localStorage.setItem("testUserWelcomed", "true");
          }
        }, 800);
      } catch (error) {
        console.error("Erro ao carregar dados do dashboard:", error);
        toast.error("Erro ao carregar dados do dashboard. Tente novamente mais tarde.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <MainLayout>
      <Loading loading={loading} />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
            <p className="text-gray-600">Bem-vindo(a) {user?.nome || "ao StudioMuda"}</p>
          </div>
          <img src={logoVasoPreta} alt="Logo Vaso Preta" className="h-20 w-auto" />
        </div>
        
        {/* Instruções para ambiente de teste */}
        {showTestInfo && localStorage.getItem("testUser") === "true" && (
          <div className="mb-8 bg-blue-50 border border-blue-200 rounded-lg p-6 shadow-sm">
            <div className="flex">
              <div className="flex-shrink-0">
                <FiInfo className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium text-blue-800">
                  Você está no modo de demonstração do sistema
                </h3>
                <div className="mt-2 text-blue-700">
                  <p className="mb-2">
                    Este ambiente de demonstração permite que você teste todas as funcionalidades do Studio Muda sem a necessidade de um servidor backend ativo.
                  </p>
                  <p>Para testar o sistema completo, siga estas etapas:</p>
                  
                  <ul className="mt-2 ml-6 space-y-1 list-disc">
                    <li className="flex items-start">
                      <span className="flex-shrink-0 h-5 w-5 inline-flex items-center justify-center mr-1">
                        <FiCheckCircle className="text-green-600" />
                      </span>
                      <span><strong>MySQL:</strong> Certifique-se que está rodando com o comando <code className="bg-blue-100 px-1 rounded">sudo systemctl start mysql</code></span>
                    </li>
                    <li className="flex items-start">
                      <span className="flex-shrink-0 h-5 w-5 inline-flex items-center justify-center mr-1">
                        <FiCheckCircle className="text-green-600" />
                      </span>
                      <span><strong>Backend Java (Jetty):</strong> Verifique se está rodando com <code className="bg-blue-100 px-1 rounded">sudo systemctl status jetty9</code></span>
                    </li>
                    <li className="flex items-start">
                      <span className="flex-shrink-0 h-5 w-5 inline-flex items-center justify-center mr-1">
                        <FiCheckCircle className="text-green-600" />
                      </span>
                      <span><strong>Frontend:</strong> Você já está rodando com <code className="bg-blue-100 px-1 rounded">npm run dev</code> (porta 5173)</span>
                    </li>
                  </ul>
                </div>
                <div className="mt-4">
                  <button
                    type="button"
                    onClick={() => setShowTestInfo(false)}
                    className="text-blue-700 hover:text-blue-900 text-sm font-medium underline"
                  >
                    Entendi, não mostrar novamente
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Cards de Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 flex items-center">
            <div className="rounded-full bg-blue-100 p-3 mr-4">
              <FiUsers className="text-blue-600 text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total de Clientes</p>
              <p className="text-2xl font-bold text-gray-800">{stats.totalClientes}</p>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 flex items-center">
            <div className="rounded-full bg-green-100 p-3 mr-4">
              <FiPackage className="text-green-600 text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total de Produtos</p>
              <p className="text-2xl font-bold text-gray-800">{stats.totalProdutos}</p>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 flex items-center">
            <div className="rounded-full bg-purple-100 p-3 mr-4">
              <FiDollarSign className="text-purple-600 text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Pedidos do Mês</p>
              <p className="text-2xl font-bold text-gray-800">{stats.totalPedidosMes}</p>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 flex items-center">
            <div className="rounded-full bg-red-100 p-3 mr-4">
              <FiAlertCircle className="text-red-600 text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Produtos Baixo Estoque</p>
              <p className="text-2xl font-bold text-gray-800">{stats.produtosBaixoEstoque}</p>
            </div>
          </div>
        </div>
        
        {/* Tabela de Vendas Recentes */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center mb-4">
            <FiShoppingCart className="text-gray-500 mr-2" />
            <h2 className="text-xl font-semibold text-gray-800">Vendas Recentes</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr className="w-full h-16 border-b border-gray-200">
                  <th className="text-left pl-4 font-medium text-gray-500">#ID</th>
                  <th className="text-left font-medium text-gray-500">Cliente</th>
                  <th className="text-left font-medium text-gray-500">Data</th>
                  <th className="text-left font-medium text-gray-500">Valor</th>
                  <th className="text-left font-medium text-gray-500">Status</th>
                </tr>
              </thead>
              <tbody>
                {stats.vendasRecentes.map((venda) => (
                  <tr key={venda.id} className="h-14 border-b border-gray-100 hover:bg-gray-50">
                    <td className="pl-4 text-gray-600">#{venda.id}</td>
                    <td className="text-gray-600">{venda.cliente}</td>
                    <td className="text-gray-600">{venda.data}</td>
                    <td className="text-gray-600">{venda.valor}</td>
                    <td>
                      <span 
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          venda.status === 'Concluído' 
                            ? 'bg-green-100 text-green-800' 
                            : venda.status === 'Pendente' 
                              ? 'bg-yellow-100 text-yellow-800' 
                              : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {venda.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Links Rápidos */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Acesso Rápido</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <a href="/pedido-venda" className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <FiShoppingCart className="text-green-600 text-2xl mb-2" />
              <span className="text-sm font-medium text-gray-700">Novo Pedido</span>
            </a>
            <a href="/cadastro-cliente" className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <FiUsers className="text-blue-600 text-2xl mb-2" />
              <span className="text-sm font-medium text-gray-700">Novo Cliente</span>
            </a>
            <a href="/controle-estoque" className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <FiPackage className="text-purple-600 text-2xl mb-2" />
              <span className="text-sm font-medium text-gray-700">Estoque</span>
            </a>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default Home;
