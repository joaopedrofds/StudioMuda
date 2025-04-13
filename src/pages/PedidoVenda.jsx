import React from "react";

function PedidoVenda() {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Geração de Pedido de Venda</h1>

      <form className="space-y-4 bg-white p-6 rounded-lg shadow-md">
        <div>
          <label className="block text-sm font-medium text-gray-700">Número do Pedido:</label>
          <input
            type="text"
            name="numeroPedido"
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Data de Requisição:</label>
          <input
            type="date"
            name="dataRequisicao"
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Data de Entrega:</label>
          <input
            type="date"
            name="dataEntrega"
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        <fieldset className="border border-gray-300 p-4 rounded-md">
          <legend className="text-sm font-medium text-gray-700">Itens Vendidos</legend>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">Código do Item:</label>
            <input
              type="text"
              name="codigoItem"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Tipo:</label>
            <input
              type="text"
              name="tipoItem"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Quantidade:</label>
            <input
              type="number"
              name="quantidadeItem"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
        </fieldset>

        <fieldset className="border border-gray-300 p-4 rounded-md">
          <legend className="text-sm font-medium text-gray-700">Dados do Cliente</legend>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">CPF/CNPJ:</label>
            <input
              type="text"
              name="cpfCnpj"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Nome:</label>
            <input
              type="text"
              name="nomeCliente"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Endereço:</label>
            <input
              type="text"
              name="enderecoCliente"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Telefone:</label>
            <input
              type="text"
              name="telefoneCliente"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
        </fieldset>

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Registrar Pedido
        </button>
      </form>
    </div>
  );
}

export default PedidoVenda;
