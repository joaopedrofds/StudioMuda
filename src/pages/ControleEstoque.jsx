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
    <div style={{ padding: "2rem" }}>
      <h1>Controle de Estoque</h1>
      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "1rem" }}>
        <thead>
          <tr style={{ background: "#f0f0f0" }}>
            <th style={thStyle}>Item</th>
            <th style={thStyle}>Tipo</th>
            <th style={thStyle}>Disponível</th>
            <th style={thStyle}>Solicitado</th>
            <th style={thStyle}>Retirado</th>
          </tr>
        </thead>
        <tbody>
          {estoque.map((item) => (
            <tr key={item.id}>
              <td style={tdStyle}>{item.nome}</td>
              <td style={tdStyle}>{item.tipo}</td>
              <td style={tdStyle}>{item.quantidadeDisponivel}</td>
              <td style={tdStyle}>{item.quantidadeSolicitada}</td>
              <td style={tdStyle}>{item.quantidadeRetirada}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const thStyle = {
  padding: "8px",
  border: "1px solid #ccc",
  fontWeight: "bold",
  textAlign: "left",
};

const tdStyle = {
  padding: "8px",
  border: "1px solid #ccc",
};

export default ControleEstoque;
