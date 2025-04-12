import { Routes, Route } from "react-router-dom";
import CadastroFuncionario from "../pages/CadastroFuncionario";
import CadastroCliente from "../pages/CadastroCliente";
import PedidoVenda from "../pages/PedidoVenda";
import SolicitacaoRetirada from "../pages/SolicitacaoRetirada";
import AprovacaoRetirada from "../pages/AprovacaoRetirada";
import ControleEstoque from "../pages/ControleEstoque";


function AppRoutes() {
  return (
    <Routes>
      <Route path="/cadastro-funcionario" element={<CadastroFuncionario />} />
      <Route path="/cadastro-cliente" element={<CadastroCliente />} />
      <Route path="/pedido-venda" element={<PedidoVenda />} />
      <Route path="/solicitacao-retirada" element={<SolicitacaoRetirada />} />  
      <Route path="/aprovacao-retirada" element={<AprovacaoRetirada />} />  
      <Route path="/controle-estoque" element={<ControleEstoque />} />
    </Routes>
  );
}

export default AppRoutes;
