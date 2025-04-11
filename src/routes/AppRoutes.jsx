// src/routes/AppRoutes.jsx

import { Routes, Route } from "react-router-dom";
import CadastroFuncionario from "../pages/CadastroFuncionario";
import CadastroCliente from "../pages/CadastroCliente";
import PedidoVenda from "../pages/PedidoVenda";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/cadastro-funcionario" element={<CadastroFuncionario />} />
      <Route path="/cadastro-cliente" element={<CadastroCliente />} />
      <Route path="/pedido-venda" element={<PedidoVenda />} />
    </Routes>
  );
}

export default AppRoutes;
