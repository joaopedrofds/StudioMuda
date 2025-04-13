import { useState } from "react";

const mockEstoque = [
  {
    id: 1,
    nome: "Cimento CP-II",
    tipo: "Construção",
    quantidadeDisponivel: 80,
    quantidadeSolicitada: 20,
    quantidadeRetirada: 30,
  },
  {
    id: 2,
    nome: "Areia Média",
    tipo: "Construção",
    quantidadeDisponivel: 100,
    quantidadeSolicitada: 10,
    quantidadeRetirada: 50,
  },
  {
    id: 3,
    nome: "Bloco de Concreto",
    tipo: "Alvenaria",
    quantidadeDisponivel: 200,
    quantidadeSolicitada: 0,
    quantidadeRetirada: 20,
  },
];

function ControleEstoque() {
  const [estoque, setEstoque] = useState(mockEstoque);

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Controle de Estoque</h1>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-4 py-2 text-left font-medium text-gray-700">Item</th>
            <th className="border border-gray-300 px-4 py-2 text-left font-medium text-gray-700">Tipo</th>
            <th className="border border-gray-300 px-4 py-2 text-left font-medium text-gray-700">Disponível</th>
            <th className="border border-gray-300 px-4 py-2 text-left font-medium text-gray-700">Solicitado</th>
            <th className="border border-gray-300 px-4 py-2 text-left font-medium text-gray-700">Retirado</th>
          </tr>
        </thead>
        <tbody>
          {estoque.map((item) => (
            <tr key={item.id} className="odd:bg-white even:bg-gray-50">
              <td className="border border-gray-300 px-4 py-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">{item.nome}</td>
              <td className="border border-gray-300 px-4 py-2 text-gray-700">{item.tipo}</td>
              <td className="border border-gray-300 px-4 py-2 text-gray-700">{item.quantidadeDisponivel}</td>
              <td className="border border-gray-300 px-4 py-2 text-gray-700">{item.quantidadeSolicitada}</td>
              <td className="border border-gray-300 px-4 py-2 text-gray-700">{item.quantidadeRetirada}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ControleEstoque;
