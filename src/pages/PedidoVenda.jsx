import React from "react";

function PedidoVenda() {
  return (
    <div style={{ padding: "2rem" }}>
      <h1>Geração de Pedido de Venda</h1>

      <form>
        <div>
          <label>Número do Pedido:</label>
          <input type="text" name="numeroPedido" required />
        </div>

        <div>
          <label>Data de Requisição:</label>
          <input type="date" name="dataRequisicao" required />
        </div>

        <div>
          <label>Data de Entrega:</label>
          <input type="date" name="dataEntrega" required />
        </div>

        <fieldset style={{ marginTop: "1rem" }}>
          <legend>Itens Vendidos</legend>

          <div>
            <label>Código do Item:</label>
            <input type="text" name="codigoItem" required />
          </div>

          <div>
            <label>Tipo:</label>
            <input type="text" name="tipoItem" required />
          </div>

          <div>
            <label>Quantidade:</label>
            <input type="number" name="quantidadeItem" required />
          </div>
        </fieldset>

        <fieldset style={{ marginTop: "1rem" }}>
          <legend>Dados do Cliente</legend>

          <div>
            <label>CPF/CNPJ:</label>
            <input type="text" name="cpfCnpj" required />
          </div>

          <div>
            <label>Nome:</label>
            <input type="text" name="nomeCliente" required />
          </div>

          <div>
            <label>Endereço:</label>
            <input type="text" name="enderecoCliente" required />
          </div>

          <div>
            <label>Telefone:</label>
            <input type="text" name="telefoneCliente" required />
          </div>
        </fieldset>

        <button type="submit" style={{ marginTop: "1rem" }}>
          Registrar Pedido
        </button>
      </form>
    </div>
  );
}

export default PedidoVenda;
