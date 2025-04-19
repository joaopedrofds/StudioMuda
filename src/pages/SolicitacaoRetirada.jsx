import React, { useState, useEffect } from "react";
import MainLayout from "../components/MainLayout";
import Loading from "../components/Loading";
import { toast } from "react-toastify";
import { estoqueService } from "../services/estoqueService";
import { produtoService } from "../services/produtoService";
import { pedidoService } from "../services/pedidoService";
import { FiPackage, FiSearch, FiClipboard, FiUser, FiSend } from "react-icons/fi";
import Button from "../components/Button";

function SolicitacaoRetirada() {
  const [loading, setLoading] = useState(false);
  const [produtos, setProdutos] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [buscarProduto, setBuscarProduto] = useState("");
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);
  const [pedidoSelecionado, setPedidoSelecionado] = useState(null);
  const [quantidade, setQuantidade] = useState(1);
  const [observacao, setObservacao] = useState("");
  const [auxiliar, setAuxiliar] = useState("");

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    setLoading(true);
    try {
      setTimeout(() => {
        const mockProdutos = [
          { id: 1, nome: "Cimento CP-II", tipo: "Construção", estoque: 80 },
          { id: 2, nome: "Areia Média", tipo: "Construção", estoque: 100 },
          { id: 3, nome: "Bloco de Concreto", tipo: "Alvenaria", estoque: 200 },
          { id: 4, nome: "Tijolo Cerâmico", tipo: "Alvenaria", estoque: 150 },
          { id: 5, nome: "Tinta Acrílica Branca 18L", tipo: "Acabamento", estoque: 10 },
          { id: 6, nome: "Argamassa Colante AC-II", tipo: "Acabamento", estoque: 50 }
        ];
        
        const mockPedidos = [
          { id: 1, numeroPedido: "PV-2025-0001", cliente: "Empresa ABC Ltda", data: "15/04/2025" },
          { id: 2, numeroPedido: "PV-2025-0002", cliente: "Construtora XYZ S.A.", data: "16/04/2025" },
          { id: 3, numeroPedido: "PV-2025-0003", cliente: "Arquitetura & Design", data: "17/04/2025" }
        ];
        
        setProdutos(mockProdutos);
        setPedidos(mockPedidos);
        setLoading(false);
      }, 800);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      toast.error("Erro ao carregar dados. Tente novamente.");
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!produtoSelecionado) {
      toast.error("Selecione um produto");
      return;
    }
    
    if (!pedidoSelecionado) {
      toast.error("Selecione um pedido");
      return;
    }
    
    if (quantidade <= 0) {
      toast.error("Quantidade deve ser maior que zero");
      return;
    }
    
    if (!auxiliar) {
      toast.error("Informe a identificação do auxiliar");
      return;
    }
    
    setLoading(true);
    try {
      const solicitacao = {
        produtoId: produtoSelecionado.id,
        pedidoId: pedidoSelecionado.id,
        quantidade,
        auxiliar,
        observacao
      };
      
      setTimeout(() => {
        toast.success("Solicitação de retirada enviada com sucesso!");
        
        setProdutoSelecionado(null);
        setPedidoSelecionado(null);
        setQuantidade(1);
        setObservacao("");
        setAuxiliar("");
        setBuscarProduto("");
        
        setLoading(false);
      }, 800);
    } catch (error) {
      console.error("Erro ao enviar solicitação:", error);
      toast.error("Erro ao enviar solicitação. Tente novamente.");
      setLoading(false);
    }
  };

  const produtosFiltrados = produtos.filter(produto => 
    produto.nome.toLowerCase().includes(buscarProduto.toLowerCase()) ||
    produto.tipo.toLowerCase().includes(buscarProduto.toLowerCase())
  );

  return (
    <MainLayout>
      <Loading loading={loading} />
      <div className="container mx-auto p-4">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center">
            <FiPackage className="text-green-600 mr-2 text-xl" />
            <div>
              <h2 className="text-xl font-semibold text-gray-800">Solicitação de Retirada</h2>
              <p className="text-sm text-gray-600 mt-1">Solicite a retirada de materiais do estoque</p>
            </div>
          </div>
          
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h3 className="text-md font-medium text-gray-800 flex items-center mb-4">
                  <FiPackage className="mr-2" /> Produto
                </h3>
                
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiSearch className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Buscar produto"
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                    value={buscarProduto}
                    onChange={(e) => setBuscarProduto(e.target.value)}
                  />
                  {buscarProduto && produtosFiltrados.length > 0 && (
                    <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                      {produtosFiltrados.map(produto => (
                        <div
                          key={produto.id}
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => {
                            setProdutoSelecionado(produto);
                            setBuscarProduto(produto.nome);
                          }}
                        >
                          <div className="font-medium">{produto.nome}</div>
                          <div className="text-sm text-gray-500">
                            {produto.tipo} - Estoque: {produto.estoque}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                {produtoSelecionado && (
                  <div className="mt-3 p-3 bg-white rounded-md shadow-sm border border-gray-200">
                    <div className="text-sm text-gray-500">Produto selecionado:</div>
                    <div className="font-medium">{produtoSelecionado.nome}</div>
                    <div className="text-sm text-gray-600">
                      {produtoSelecionado.tipo} | Estoque disponível: {produtoSelecionado.estoque}
                    </div>
                    <button
                      type="button"
                      className="text-xs text-red-600 hover:text-red-800 mt-1"
                      onClick={() => {
                        setProdutoSelecionado(null);
                        setBuscarProduto("");
                      }}
                    >
                      Remover seleção
                    </button>
                  </div>
                )}
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h3 className="text-md font-medium text-gray-800 mb-4">Quantidade</h3>
                <input
                  type="number"
                  min="1"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  value={quantidade}
                  onChange={(e) => setQuantidade(parseInt(e.target.value))}
                  required
                />
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h3 className="text-md font-medium text-gray-800 flex items-center mb-4">
                  <FiClipboard className="mr-2" /> Pedido Relacionado
                </h3>
                
                <select
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  value={pedidoSelecionado ? pedidoSelecionado.id : ""}
                  onChange={(e) => {
                    const id = parseInt(e.target.value);
                    if (id) {
                      const pedido = pedidos.find(p => p.id === id);
                      setPedidoSelecionado(pedido);
                    } else {
                      setPedidoSelecionado(null);
                    }
                  }}
                  required
                >
                  <option value="">Selecione um pedido</option>
                  {pedidos.map(pedido => (
                    <option key={pedido.id} value={pedido.id}>
                      {pedido.numeroPedido} - {pedido.cliente}
                    </option>
                  ))}
                </select>
                
                {pedidoSelecionado && (
                  <div className="mt-3 p-3 bg-white rounded-md shadow-sm border border-gray-200">
                    <div className="text-sm text-gray-500">Pedido selecionado:</div>
                    <div className="font-medium">{pedidoSelecionado.numeroPedido}</div>
                    <div className="text-sm text-gray-600">
                      Cliente: {pedidoSelecionado.cliente} | Data: {pedidoSelecionado.data}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h3 className="text-md font-medium text-gray-800 flex items-center mb-4">
                  <FiUser className="mr-2" /> Identificação do Auxiliar
                </h3>
                <input
                  type="text"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  value={auxiliar}
                  onChange={(e) => setAuxiliar(e.target.value)}
                  placeholder="Nome ou ID do auxiliar responsável"
                  required
                />
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h3 className="text-md font-medium text-gray-800 mb-4">Observações</h3>
                <textarea
                  rows="3"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  value={observacao}
                  onChange={(e) => setObservacao(e.target.value)}
                  placeholder="Observações adicionais sobre a solicitação (opcional)"
                ></textarea>
              </div>
              
              <div className="flex justify-end pt-4 border-t border-gray-200">
                <Button
                  type="submit"
                  variant="primary"
                  className="flex items-center justify-center font-medium"
                  disabled={loading || !produtoSelecionado || !pedidoSelecionado || quantidade <= 0 || !auxiliar}
                >
                  <FiSend className="mr-2" />
                  Enviar Solicitação
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default SolicitacaoRetirada;
