import React, { useState, useEffect } from "react";
import MainLayout from "../components/MainLayout";
import Loading from "../components/Loading";
import { toast } from "react-toastify";
import { clienteService } from "../services/clienteService";
import { produtoService } from "../services/produtoService";
import { pedidoService } from "../services/pedidoService";
import { FiShoppingCart, FiPlus, FiTrash2, FiSearch, FiUser, FiPackage, FiDollarSign } from "react-icons/fi";
import Button from "../components/Button";

function PedidoVenda() {
  const [loading, setLoading] = useState(false);
  const [clientes, setClientes] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [clienteSelecionado, setClienteSelecionado] = useState(null);
  const [itensPedido, setItensPedido] = useState([]);
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);
  const [quantidade, setQuantidade] = useState(1);
  const [buscarCliente, setBuscarCliente] = useState("");
  const [buscarProduto, setBuscarProduto] = useState("");
  const [observacoes, setObservacoes] = useState("");
  const [mostrarModalCliente, setMostrarModalCliente] = useState(false);
  const [totalPedido, setTotalPedido] = useState(0);

  useEffect(() => {
    carregarDados();
  }, []);

  // Recalcular o total sempre que itensPedido mudar
  useEffect(() => {
    const novoTotal = itensPedido.reduce((total, item) => {
      return total + (item.quantidade * item.valorUnitario);
    }, 0);
    setTotalPedido(novoTotal);
  }, [itensPedido]);

  const carregarDados = async () => {
    setLoading(true);
    try {
      // Em um ambiente real, estas seriam chamadas ao backend
      // Simulando resposta do backend com um atraso
      setTimeout(() => {
        // Mock de dados
        const mockClientes = [
          { id: 1, nome: "Empresa ABC Ltda", cpfCnpj: "12345678901234", endereco: "Rua das Flores, 123", telefone: "(11) 99999-8888" },
          { id: 2, nome: "Construtora XYZ S.A.", cpfCnpj: "98765432109876", endereco: "Av. Central, 456", telefone: "(11) 97777-6666" },
          { id: 3, nome: "Arquitetura & Design", cpfCnpj: "45678912301234", endereco: "Rua dos Arquitetos, 789", telefone: "(11) 95555-4444" },
          { id: 4, nome: "Incorporadora Vista", cpfCnpj: "76543210987654", endereco: "Alameda dos Anjos, 1010", telefone: "(11) 93333-2222" },
          { id: 5, nome: "Casa & Design", cpfCnpj: "23456789012345", endereco: "Rua das Casas, 222", telefone: "(11) 92222-1111" }
        ];
        
        const mockProdutos = [
          { id: 1, nome: "Cimento CP-II", tipo: "Construção", valorUnitario: 25.90, estoque: 80 },
          { id: 2, nome: "Areia Média", tipo: "Construção", valorUnitario: 5.50, estoque: 100 },
          { id: 3, nome: "Bloco de Concreto", tipo: "Alvenaria", valorUnitario: 3.75, estoque: 200 },
          { id: 4, nome: "Tijolo Cerâmico", tipo: "Alvenaria", valorUnitario: 1.90, estoque: 150 },
          { id: 5, nome: "Tinta Acrílica Branca 18L", tipo: "Acabamento", valorUnitario: 249.90, estoque: 10 },
          { id: 6, nome: "Argamassa Colante AC-II", tipo: "Acabamento", valorUnitario: 22.50, estoque: 50 }
        ];
        
        // Em produção, usaríamos:
        // const clientes = await clienteService.listarAtivos();
        // const produtos = await produtoService.listarTodos();
        
        setClientes(mockClientes);
        setProdutos(mockProdutos);
        setLoading(false);
      }, 800);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      toast.error("Erro ao carregar dados. Tente novamente.");
      setLoading(false);
    }
  };

  const adicionarItem = () => {
    if (!produtoSelecionado) {
      toast.error("Selecione um produto");
      return;
    }

    if (quantidade <= 0) {
      toast.error("Quantidade deve ser maior que zero");
      return;
    }

    // Verificar se o produto já existe no pedido
    const itemExistente = itensPedido.find(item => item.produtoId === produtoSelecionado.id);
    
    if (itemExistente) {
      // Atualizar quantidade se já existe
      const novosItens = itensPedido.map(item => {
        if (item.produtoId === produtoSelecionado.id) {
          return {
            ...item,
            quantidade: item.quantidade + parseInt(quantidade),
            valorTotal: (item.quantidade + parseInt(quantidade)) * item.valorUnitario
          };
        }
        return item;
      });
      
      setItensPedido(novosItens);
      toast.success("Quantidade atualizada");
    } else {
      // Adicionar novo item
      const novoItem = {
        produtoId: produtoSelecionado.id,
        nomeProduto: produtoSelecionado.nome,
        quantidade: parseInt(quantidade),
        valorUnitario: produtoSelecionado.valorUnitario,
        valorTotal: parseInt(quantidade) * produtoSelecionado.valorUnitario
      };
      
      setItensPedido([...itensPedido, novoItem]);
      toast.success("Item adicionado ao pedido");
    }
    
    // Limpar seleção
    setProdutoSelecionado(null);
    setQuantidade(1);
    setBuscarProduto("");
  };

  const removerItem = (produtoId) => {
    const novosItens = itensPedido.filter(item => item.produtoId !== produtoId);
    setItensPedido(novosItens);
    toast.info("Item removido do pedido");
  };

  const selecionarCliente = (cliente) => {
    setClienteSelecionado(cliente);
    setMostrarModalCliente(false);
    toast.success(`Cliente ${cliente.nome} selecionado`);
  };

  const finalizarPedido = async () => {
    if (!clienteSelecionado) {
      toast.error("Selecione um cliente para o pedido");
      return;
    }

    if (itensPedido.length === 0) {
      toast.error("Adicione pelo menos um item ao pedido");
      return;
    }

    setLoading(true);
    try {
      const pedido = {
        clienteId: clienteSelecionado.id,
        itens: itensPedido,
        valorTotal: totalPedido,
        observacoes: observacoes
      };
      
      // Em produção, usaríamos:
      // await pedidoService.cadastrar(pedido);
      
      // Simulando resposta do backend
      setTimeout(() => {
        toast.success("Pedido registrado com sucesso!");
        
        // Limpar o formulário
        setClienteSelecionado(null);
        setItensPedido([]);
        setObservacoes("");
        
        setLoading(false);
      }, 800);
      
    } catch (error) {
      console.error("Erro ao finalizar pedido:", error);
      toast.error("Erro ao registrar pedido. Tente novamente.");
      setLoading(false);
    }
  };

  // Filtrar clientes baseado na busca
  const clientesFiltrados = clientes.filter(cliente => 
    cliente.nome.toLowerCase().includes(buscarCliente.toLowerCase()) ||
    cliente.cpfCnpj.includes(buscarCliente)
  );

  // Filtrar produtos baseado na busca
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
            <FiShoppingCart className="text-green-600 mr-2 text-xl" />
            <div>
              <h2 className="text-xl font-semibold text-gray-800">Pedido de Venda</h2>
              <p className="text-sm text-gray-600 mt-1">Crie um novo pedido de venda</p>
            </div>
          </div>
          
          <div className="p-6 space-y-6">
            {/* Seleção de Cliente */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-800 flex items-center">
                  <FiUser className="mr-2" /> Cliente
                </h3>
                <Button 
                  variant="secondary"
                  className="text-sm py-1"
                  onClick={() => setMostrarModalCliente(true)}
                >
                  Selecionar Cliente
                </Button>
              </div>
              
              {clienteSelecionado ? (
                <div className="p-3 bg-white rounded-md shadow-sm">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs text-gray-500">Nome</p>
                      <p className="font-medium">{clienteSelecionado.nome}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">CPF/CNPJ</p>
                      <p className="font-medium">{clienteSelecionado.cpfCnpj}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Endereço</p>
                      <p className="font-medium">{clienteSelecionado.endereco}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Telefone</p>
                      <p className="font-medium">{clienteSelecionado.telefone}</p>
                    </div>
                  </div>
                  <Button 
                    variant="outline"
                    className="text-xs mt-2"
                    onClick={() => setClienteSelecionado(null)}
                  >
                    Trocar Cliente
                  </Button>
                </div>
              ) : (
                <div className="flex justify-center p-4 bg-white rounded-md shadow-sm">
                  <p className="text-gray-500 italic">Nenhum cliente selecionado</p>
                </div>
              )}
            </div>
            
            {/* Adicionar Produtos */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h3 className="text-lg font-medium text-gray-800 flex items-center mb-4">
                <FiPackage className="mr-2" /> Produtos
              </h3>
              
              <div className="flex flex-col md:flex-row gap-4 mb-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Produto
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Buscar produto"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
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
                              {produto.tipo} - R$ {produto.valorUnitario.toFixed(2)} - Estoque: {produto.estoque}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="w-full md:w-24">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Quantidade
                  </label>
                  <input
                    type="number"
                    min="1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                    value={quantidade}
                    onChange={(e) => setQuantidade(e.target.value)}
                  />
                </div>
                
                <div className="self-end">
                  <Button
                    variant="primary"
                    className="w-full flex items-center justify-center"
                    onClick={adicionarItem}
                  >
                    <FiPlus className="mr-1" /> Adicionar
                  </Button>
                </div>
              </div>
              
              {/* Tabela de Itens do Pedido */}
              <div className="bg-white rounded-md shadow-sm overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Produto
                      </th>
                      <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                        Qtd
                      </th>
                      <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                        Valor Unit.
                      </th>
                      <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                        Subtotal
                      </th>
                      <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {itensPedido.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="px-4 py-4 text-sm text-center text-gray-500">
                          Nenhum produto adicionado
                        </td>
                      </tr>
                    ) : (
                      itensPedido.map((item) => (
                        <tr key={item.produtoId}>
                          <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {item.nomeProduto}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-right text-gray-500">
                            {item.quantidade}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-right text-gray-500">
                            R$ {item.valorUnitario.toFixed(2)}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-right font-medium text-gray-900">
                            R$ {item.valorTotal.toFixed(2)}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-right">
                            <button
                              className="text-red-600 hover:text-red-900"
                              onClick={() => removerItem(item.produtoId)}
                            >
                              <FiTrash2 />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                  {itensPedido.length > 0 && (
                    <tfoot className="bg-gray-100">
                      <tr>
                        <td colSpan="3" className="px-4 py-3 text-sm font-medium text-right text-gray-900">
                          Total do Pedido:
                        </td>
                        <td className="px-4 py-3 text-sm text-right font-bold text-gray-900">
                          R$ {totalPedido.toFixed(2)}
                        </td>
                        <td></td>
                      </tr>
                    </tfoot>
                  )}
                </table>
              </div>
            </div>
            
            {/* Observações */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Observações</h3>
              <textarea
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                placeholder="Observações adicionais sobre o pedido"
                value={observacoes}
                onChange={(e) => setObservacoes(e.target.value)}
              ></textarea>
            </div>
            
            {/* Botão de Finalizar */}
            <div className="flex justify-end pt-4 border-t border-gray-200">
              <Button
                variant="primary"
                className="flex items-center justify-center font-medium"
                onClick={finalizarPedido}
                disabled={loading || !clienteSelecionado || itensPedido.length === 0}
              >
                <FiShoppingCart className="mr-2" />
                Finalizar Pedido
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Modal de Seleção de Cliente */}
      {mostrarModalCliente && (
        <div className="fixed inset-0 overflow-y-auto z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setMostrarModalCliente(false)}></div>
          <div className="relative bg-white rounded-lg max-w-lg w-full mx-4 shadow-xl">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 rounded-t-lg flex items-center">
              <FiUser className="text-green-600 mr-2" />
              <h3 className="text-lg font-medium text-gray-900">
                Selecionar Cliente
              </h3>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiSearch className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                    placeholder="Buscar cliente por nome ou CPF/CNPJ"
                    value={buscarCliente}
                    onChange={(e) => setBuscarCliente(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="max-h-60 overflow-y-auto border border-gray-200 rounded-md">
                {clientesFiltrados.length === 0 ? (
                  <div className="p-4 text-sm text-center text-gray-500">
                    Nenhum cliente encontrado
                  </div>
                ) : (
                  <div className="divide-y divide-gray-200">
                    {clientesFiltrados.map(cliente => (
                      <div
                        key={cliente.id}
                        className="p-4 hover:bg-gray-50 cursor-pointer"
                        onClick={() => selecionarCliente(cliente)}
                      >
                        <div className="font-medium">{cliente.nome}</div>
                        <div className="text-sm text-gray-500">
                          CPF/CNPJ: {cliente.cpfCnpj} | Telefone: {cliente.telefone}
                        </div>
                        <div className="text-sm text-gray-500">
                          {cliente.endereco}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="flex justify-end mt-6">
                <Button
                  variant="secondary"
                  onClick={() => setMostrarModalCliente(false)}
                >
                  Cancelar
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
}

export default PedidoVenda;
