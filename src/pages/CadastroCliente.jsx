// src/pages/CadastroCliente.jsx

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import FormField from "../components/FormField";
import Button from "../components/Button";

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
    <div className="container mx-auto p-8">
      <h2 className="text-3xl font-bold mb-6 text-center">Cadastro de Cliente</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 bg-white p-6 rounded-lg shadow-md">
        <FormField
          label="Nome"
          placeholder="Nome"
          register={register("nome")}
          error={errors.nome?.message}
          className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600"
        />
        <FormField
          label="CPF ou CNPJ"
          placeholder="CPF ou CNPJ"
          register={register("cpfCnpj")}
          error={errors.cpfCnpj?.message}
        />
        <FormField
          label="Endereço"
          placeholder="Endereço"
          register={register("endereco")}
          error={errors.endereco?.message}
        />
        <FormField
          label="Telefone Celular"
          placeholder="(XX) XXXXX-XXXX"
          register={register("telefoneCelular")}
          error={errors.telefoneCelular?.message}
        />
        <FormField
          label="Telefone Fixo (opcional)"
          placeholder="(XX) XXXX-XXXX"
          register={register("telefoneFixo")}
        />
        <FormField
          label="Email"
          placeholder="seuemail@exemplo.com"
          register={register("email")}
          error={errors.email?.message}
        />
        <Button type="submit" variant="primary">
          Cadastrar Cliente
        </Button>
      </form>
    </div>
  );
}

export default CadastroCliente;


