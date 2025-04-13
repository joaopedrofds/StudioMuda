import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import CadastroFuncionario from "../pages/CadastroFuncionario";
import CadastroCliente from "../pages/CadastroCliente";
import PedidoVenda from "../pages/PedidoVenda";
import SolicitacaoRetirada from "../pages/SolicitacaoRetirada";
import AprovacaoRetirada from "../pages/AprovacaoRetirada";
import ControleEstoque from "../pages/ControleEstoque";
import Login from "../pages/Login";
import Registro from "../pages/Registro";

function AppRoutes() {
  const { user } = useContext(AuthContext);

  return (
    <Routes>
      {user ? (
        // Rotas protegidas
        <>
          <Route path="/home" element={<Home />} />
          <Route path="/cadastro-funcionario" element={<CadastroFuncionario />} />
          <Route path="/cadastro-cliente" element={<CadastroCliente />} />
          <Route path="/pedido-venda" element={<PedidoVenda />} />
          <Route path="/solicitacao-retirada" element={<SolicitacaoRetirada />} />
          <Route path="/aprovacao-retirada" element={<AprovacaoRetirada />} />
          <Route path="/controle-estoque" element={<ControleEstoque />} />
        </>
      ) : (
        // Rotas públicas
        <>
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
        </>
      )}
    </Routes>
  );
}

export default AppRoutes;
