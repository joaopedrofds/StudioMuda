import { Link } from "react-router-dom";

function Home() {
  return (
    <div style={{ padding: "2rem" }}>
      <h1>Menu Inicial</h1>
      <ul>
        <li><Link to="/cadastro-funcionario">Cadastro de Funcionário</Link></li>
        <li><Link to="/acesso-seguranca">Acesso e Segurança</Link></li>
        <li><Link to="/cadastro-cliente">Cadastro de Cliente</Link></li>
        <li><Link to="/pedido-venda">Pedido de Venda</Link></li>
        <li><Link to="/solicitacao-retirada">Solicitação de Retirada</Link></li>
        <li><Link to="/aprovacao-retirada">Aprovação de Retirada</Link></li>
        <li><Link to="/controle-estoque">Controle de Estoque</Link></li>
        <li><Link to="/movimentacao-estoque">Movimentação de Estoque</Link></li>
      </ul>
    </div>
  );
}

export default Home;
