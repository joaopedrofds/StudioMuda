import React, { useState, useEffect } from "react";
import MainLayout from "../components/MainLayout";
import Loading from "../components/Loading";
import { toast } from "react-toastify";
import { estoqueService } from "../services/estoqueService";
import { FiPackage, FiPlus, FiMinus, FiRefreshCw, FiSearch, FiFilter } from "react-icons/fi";
import Button from "../components/Button";

function ControleEstoque() {
  const [estoque, setEstoque] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [movimentacao, setMovimentacao] = useState({
    tipo: "E", // E = Entrada, S = Saída
    produtoId: null,
    quantidade: "",
    observacao: ""
  });

  useEffect(() => {
    fetchEstoque();
  }, []);

  const fetchEstoque = async () => {
    setLoading(true);
    try {
      // Chamada real ao backend Java
      const data = await estoqueService.obterSituacaoAtual();
      setEstoque(data);
    } catch (error) {
      console.error("Erro ao carregar estoque:", error);
      toast.error("Erro ao carregar dados do estoque. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterMovement = async () => {
    if (!movimentacao.produtoId || !movimentacao.quantidade || movimentacao.quantidade <= 0) {
      toast.error("Preencha todos os campos corretamente");
      return;
    }
    
    setLoading(true);
    try {
      // Chamada real ao backend Java
      if (movimentacao.tipo === "E") {
        await estoqueService.registrarEntrada(movimentacao);
        toast.success("Entrada de estoque registrada com sucesso!");
      } else {
        await estoqueService.registrarSaida(movimentacao);
        toast.success("Saída de estoque registrada com sucesso!");
      }
      
      // Atualizar a lista de estoque
      fetchEstoque();
      setShowModal(false);
      setMovimentacao({
        tipo: "E",
        produtoId: null,
        quantidade: "",
        observacao: ""
      });
    } catch (error) {
      console.error("Erro ao registrar movimentação de estoque:", error);
      toast.error("Erro ao registrar movimentação. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const openMovementModal = (produto, tipo) => {
    setMovimentacao({
      tipo,
      produtoId: produto.id,
      nomeProduto: produto.nome,
      quantidade: "",
      observacao: ""
    });
    setShowModal(true);
  };

  // Filtrar estoque com base na busca e tipo
  const filteredEstoque = estoque.filter(item => {
    return (
      item.nome.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filterType === "" || item.tipo === filterType)
    );
  });

  // Extrair tipos únicos para o filtro
  const tiposUnicos = [...new Set(estoque.map(item => item.tipo))];

  return (
    <MainLayout>
      <Loading loading={loading} />
      <div className="container mx-auto p-4">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center">
              <FiPackage className="text-green-600 mr-2 text-xl" />
              <div>
                <h2 className="text-xl font-semibold text-gray-800">Controle de Estoque</h2>
                <p className="text-sm text-gray-600 mt-1">Gerencie o estoque de produtos</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button 
                variant="primary"
                className="flex items-center justify-center"
                onClick={() => setShowModal(true)}
              >
                <FiPlus className="mr-1" />
                Nova Entrada
              </Button>
              <Button 
                variant="secondary"
                className="flex items-center justify-center"
                onClick={fetchEstoque}
              >
                <FiRefreshCw className="mr-1" />
                Atualizar
              </Button>
            </div>
          </div>
          
          {/* Filtros e Busca */}
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4">
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  placeholder="Buscar produto..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="relative inline-flex md:w-48">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiFilter className="text-gray-400" />
                </div>
                <select
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                >
                  <option value="">Todos os tipos</option>
                  {tiposUnicos.map((tipo) => (
                    <option key={tipo} value={tipo}>{tipo}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          
          {/* Tabela de Estoque */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Produto
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Disponível
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Solicitado
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Última Mov.
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredEstoque.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                      Nenhum produto encontrado
                    </td>
                  </tr>
                ) : (
                  filteredEstoque.map((item) => (
                    <tr key={item.id} className={item.quantidadeDisponivel <= item.quantidadeMinima ? "bg-red-50" : ""}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{item.nome}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{item.tipo}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          item.quantidadeDisponivel <= item.quantidadeMinima
                            ? "bg-red-100 text-red-800"
                            : "bg-green-100 text-green-800"
                        }`}>
                          {item.quantidadeDisponivel}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.quantidadeSolicitada}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.ultimaMovimentacao}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => openMovementModal(item, "E")}
                            className="text-green-600 hover:text-green-900"
                          >
                            <FiPlus className="h-5 w-5" title="Registrar entrada" />
                          </button>
                          <button
                            onClick={() => openMovementModal(item, "S")}
                            className="text-red-600 hover:text-red-900"
                            disabled={item.quantidadeDisponivel <= 0}
                          >
                            <FiMinus className="h-5 w-5" title="Registrar saída" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      {/* Modal de Movimentação de Estoque */}
      {showModal && (
        <div className="fixed inset-0 overflow-y-auto z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setShowModal(false)}></div>
          <div className="relative bg-white rounded-lg max-w-md w-full mx-4 shadow-xl">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 rounded-t-lg">
              <h3 className="text-lg font-medium text-gray-900">
                {movimentacao.tipo === "E" ? "Registrar Entrada" : "Registrar Saída"}
              </h3>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Produto
                </label>
                <div className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50">
                  {movimentacao.produtoId 
                    ? movimentacao.nomeProduto 
                    : (
                      <select
                        className="block w-full bg-transparent focus:outline-none"
                        value={movimentacao.produtoId || ""}
                        onChange={(e) => {
                          const produto = estoque.find(p => p.id === parseInt(e.target.value));
                          setMovimentacao({
                            ...movimentacao,
                            produtoId: parseInt(e.target.value),
                            nomeProduto: produto ? produto.nome : ""
                          });
                        }}
                      >
                        <option value="">Selecione um produto</option>
                        {estoque.map((produto) => (
                          <option key={produto.id} value={produto.id}>
                            {produto.nome}
                          </option>
                        ))}
                      </select>
                    )
                  }
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantidade
                </label>
                <input
                  type="number"
                  min="1"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  value={movimentacao.quantidade}
                  onChange={(e) => setMovimentacao({...movimentacao, quantidade: e.target.value})}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Observação
                </label>
                <textarea
                  rows="3"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  value={movimentacao.observacao}
                  onChange={(e) => setMovimentacao({...movimentacao, observacao: e.target.value})}
                ></textarea>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <Button
                  variant="secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancelar
                </Button>
                <Button
                  variant="primary"
                  onClick={handleRegisterMovement}
                  disabled={loading}
                >
                  {movimentacao.tipo === "E" ? "Registrar Entrada" : "Registrar Saída"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
}

export default ControleEstoque;
