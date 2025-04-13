import React from "react";
import Button from "../components/Button";

function AprovacaoRetirada() {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Aprovação de Retirada</h1>
      <p className="text-lg text-gray-700 text-center mb-4">
        Aqui o diretor pode aprovar ou recusar solicitações de retirada.
      </p>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Solicitações Pendentes</h2>
        <ul className="space-y-4">
          <li className="border border-gray-300 p-4 rounded-md">
            <p className="text-gray-700">Solicitação #12345</p>
            <div className="mt-2 flex justify-end space-x-2">
              <Button variant="primary">Aprovar</Button>
              <Button variant="danger">Recusar</Button>
            </div>
          </li>
          <li className="border border-gray-300 p-4 rounded-md">
            <p className="text-gray-700">Solicitação #12346</p>
            <div className="mt-2 flex justify-end space-x-2">
              <Button variant="primary">Aprovar</Button>
              <Button variant="danger">Recusar</Button>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default AprovacaoRetirada;
