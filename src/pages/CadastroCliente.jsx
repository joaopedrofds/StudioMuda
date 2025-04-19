// src/pages/CadastroCliente.jsx

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import FormField from "../components/FormField";
import Button from "../components/Button";
import MainLayout from "../components/MainLayout";
import Loading from "../components/Loading";
import { toast } from "react-toastify";
import { clienteService } from "../services/clienteService";
import { FiSave, FiX } from "react-icons/fi";

const schema = z.object({
  nome: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
  cpfCnpj: z.string().min(11, "CPF/CNPJ inválido"),
  endereco: z.string().min(5, "Endereço é obrigatório e deve ser completo"),
  telefoneCelular: z.string().min(10, "Celular inválido"),
  telefoneFixo: z.string().optional(),
  email: z.string().email("Email inválido"),
});

function CadastroCliente() {
  const [loading, setLoading] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      // Chamada real ao backend Java
      await clienteService.cadastrar(data);
      
      toast.success("Cliente cadastrado com sucesso!");
      reset(); // Limpa o formulário após o cadastro
    } catch (error) {
      console.error("Erro ao cadastrar cliente:", error);
      toast.error("Erro ao cadastrar cliente. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    reset();
    toast.info("Formulário limpo");
  };

  return (
    <MainLayout>
      <Loading loading={loading} />
      <div className="container mx-auto p-4 max-w-4xl">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">Cadastro de Cliente</h2>
            <p className="text-sm text-gray-600 mt-1">Adicione um novo cliente ao sistema</p>
          </div>
          
          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <FormField
                  label="Nome"
                  placeholder="Nome completo"
                  register={register("nome")}
                  error={errors.nome?.message}
                />
              </div>
              
              <div>
                <FormField
                  label="CPF ou CNPJ"
                  placeholder="CPF ou CNPJ sem pontuação"
                  register={register("cpfCnpj")}
                  error={errors.cpfCnpj?.message}
                />
              </div>
            </div>
            
            <FormField
              label="Endereço"
              placeholder="Endereço completo"
              register={register("endereco")}
              error={errors.endereco?.message}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <FormField
                  label="Telefone Celular"
                  placeholder="(XX) XXXXX-XXXX"
                  register={register("telefoneCelular")}
                  error={errors.telefoneCelular?.message}
                />
              </div>
              
              <div>
                <FormField
                  label="Telefone Fixo (opcional)"
                  placeholder="(XX) XXXX-XXXX"
                  register={register("telefoneFixo")}
                />
              </div>
            </div>
            
            <FormField
              label="Email"
              placeholder="seuemail@exemplo.com"
              register={register("email")}
              error={errors.email?.message}
            />

            <div className="flex justify-end space-x-4 pt-4 border-t">
              <Button 
                type="button" 
                variant="secondary"
                onClick={handleCancel}
                className="flex items-center justify-center"
              >
                <FiX className="mr-2" />
                Cancelar
              </Button>
              
              <Button 
                type="submit" 
                variant="primary"
                disabled={loading}
                className="flex items-center justify-center"
              >
                <FiSave className="mr-2" />
                Cadastrar Cliente
              </Button>
            </div>
          </form>
        </div>
      </div>
    </MainLayout>
  );
}

export default CadastroCliente;


