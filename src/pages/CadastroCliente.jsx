// src/pages/CadastroCliente.jsx

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
  cpfCnpj: z.string().min(11, "CPF/CNPJ inválido"),
  endereco: z.string().min(1, "Endereço é obrigatório"),
  telefoneCelular: z.string().min(8, "Celular inválido"),
  telefoneFixo: z.string().optional(),
  email: z.string().email("Email inválido"),
});

function CadastroCliente() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data) => {
    console.log("Cliente cadastrado:", data);
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Cadastro de Cliente</h2>
      <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <input placeholder="Nome" {...register("nome")} />
        {errors.nome && <span>{errors.nome.message}</span>}

        <input placeholder="CPF ou CNPJ" {...register("cpfCnpj")} />
        {errors.cpfCnpj && <span>{errors.cpfCnpj.message}</span>}

        <input placeholder="Endereço" {...register("endereco")} />
        {errors.endereco && <span>{errors.endereco.message}</span>}

        <input placeholder="Telefone Celular" {...register("telefoneCelular")} />
        {errors.telefoneCelular && <span>{errors.telefoneCelular.message}</span>}

        <input placeholder="Telefone Fixo (opcional)" {...register("telefoneFixo")} />

        <input placeholder="Email" {...register("email")} />
        {errors.email && <span>{errors.email.message}</span>}

        <button type="submit">Cadastrar Cliente</button>
      </form>
    </div>
  );
}


export default CadastroCliente;


