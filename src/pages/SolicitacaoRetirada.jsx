import React from "react";

function SolicitacaoRetirada() {
  return (
    <div style={{ padding: "2rem" }}>
      <h1>Solicitação de Retirada</h1>

      <form>
        <div>
          <label>Item:</label>
          <input type="text" name="item" required />
        </div>

        <div>
          <label>Quantidade:</label>
          <input type="number" name="quantidade" required />
        </div>

        <div>
          <label>Número do Pedido de Venda:</label>
          <input type="text" name="pedidoVenda" required />
        </div>

        <div>
          <label>Identificação do Auxiliar:</label>
          <input type="text" name="auxiliar" required />
        </div>

        <button type="submit" style={{ marginTop: "1rem" }}>
          Enviar Solicitação
        </button>
      </form>
    </div>
  );
}

export default SolicitacaoRetirada;
