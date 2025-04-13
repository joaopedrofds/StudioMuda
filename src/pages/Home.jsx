import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";

function Home() {
  const { user } = useContext(AuthContext);

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-12 flex flex-col items-center">
        <h1 className="text-5xl font-extrabold mb-10 text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-400 dark:to-purple-500">
          StudioMuda ERP
        </h1>
        <p className="text-lg text-gray-700 text-center mb-6">
          Por favor, <Link to="/registro" className="text-indigo-600 hover:underline">registre-se</Link> ou <Link to="/login" className="text-indigo-600 hover:underline">faça login</Link> para acessar o sistema.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 flex flex-col items-center">
      <h1 className="text-5xl font-extrabold mb-10 text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-400 dark:to-purple-500">
        StudioMuda ERP
      </h1>
      <nav className="bg-white dark:bg-gray-800 shadow-xl rounded-xl p-8 w-full max-w-lg">
        <h2 className="text-3xl font-semibold mb-6 text-center text-gray-800 dark:text-gray-200">Menu Principal</h2>
        <ul className="space-y-3">
          <li><Link to="/cadastro-funcionario" className="block py-3 px-4 text-lg rounded-md hover:bg-blue-100 dark:hover:bg-gray-700 transition duration-150 ease-in-out text-blue-700 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-200">Cadastro de Funcionário</Link></li>
          <li><Link to="/cadastro-cliente" className="block py-3 px-4 text-lg rounded-md hover:bg-blue-100 dark:hover:bg-gray-700 transition duration-150 ease-in-out text-blue-700 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-200">Cadastro de Cliente</Link></li>
          <li><Link to="/pedido-venda" className="block py-3 px-4 text-lg rounded-md hover:bg-blue-100 dark:hover:bg-gray-700 transition duration-150 ease-in-out text-blue-700 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-200">Pedido de Venda</Link></li>
          <li><Link to="/solicitacao-retirada" className="block py-3 px-4 text-lg rounded-md hover:bg-blue-100 dark:hover:bg-gray-700 transition duration-150 ease-in-out text-blue-700 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-200">Solicitação de Retirada</Link></li>
          <li><Link to="/aprovacao-retirada" className="block py-3 px-4 text-lg rounded-md hover:bg-blue-100 dark:hover:bg-gray-700 transition duration-150 ease-in-out text-blue-700 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-200">Aprovação de Retirada</Link></li>
          <li><Link to="/controle-estoque" className="block py-3 px-4 text-lg rounded-md hover:bg-blue-100 dark:hover:bg-gray-700 transition duration-150 ease-in-out text-blue-700 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-200">Controle de Estoque</Link></li>
        </ul>
      </nav>
    </div>
  );
}

export default Home;
