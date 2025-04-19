import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import bcrypt from 'bcryptjs';
import FormField from '../components/FormField';
import Button from "../components/Button";
import MainLayout from "../components/MainLayout";
import Loading from "../components/Loading";
import { toast } from "react-toastify";
import { funcionarioService } from "../services/funcionarioService";
import { FiUser, FiSave, FiX } from "react-icons/fi";

const schema = z.object({
  matricula: z.string().min(1, 'Obrigatório'),
  nome: z.string().min(3, 'Nome muito curto'),
  cpf: z.string().regex(/^\d{11}$/, 'CPF inválido'),
  rg: z.string().min(5, 'RG inválido'),
  telefone: z.string().min(10, 'Telefone inválido'),
  endereco: z.object({
    rua: z.string().min(1, 'Rua é obrigatória'),
    numero: z.string().min(1, 'Número é obrigatório'),
    bairro: z.string().min(1, 'Bairro é obrigatório'),
    cidade: z.string().min(1, 'Cidade é obrigatória'),
  }),
  email: z.string().email('E-mail inválido'),
  funcao: z.enum(['Diretor', 'Auxiliar', 'Estoquista']),
  login: z.string().min(3, 'Login deve ter pelo menos 3 caracteres'),
  senha: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
});

export default function CadastroFuncionario() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      // Em um ambiente real, esta seria uma chamada ao backend
      // Como é uma simulação, vamos usar uma chamada simulada
      
      // Encriptar a senha antes de enviar
      const senhaCriptografada = await bcrypt.hash(data.senha, 10);
      const payload = {
        ...data,
        senha: senhaCriptografada,
      };
      
      // Simulando resposta do backend com um atraso
      setTimeout(async () => {
        // Em produção, usaríamos:
        // await funcionarioService.cadastrar(payload);
        
        toast.success("Funcionário cadastrado com sucesso!");
        reset(); // Limpa o formulário após o cadastro
        setLoading(false);
      }, 800);
      
    } catch (error) {
      console.error("Erro ao cadastrar funcionário:", error);
      toast.error("Erro ao cadastrar funcionário. Tente novamente.");
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
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center">
            <FiUser className="text-green-600 mr-2 text-xl" />
            <div>
              <h2 className="text-xl font-semibold text-gray-800">Cadastro de Funcionário</h2>
              <p className="text-sm text-gray-600 mt-1">Adicione um novo funcionário ao sistema</p>
            </div>
          </div>
          
          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <FormField
                  label="Matrícula"
                  placeholder="Número de matrícula"
                  register={register('matricula')}
                  error={errors.matricula?.message}
                />
              </div>
              
              <div>
                <FormField
                  label="Nome completo"
                  placeholder="Nome completo"
                  register={register('nome')}
                  error={errors.nome?.message}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <FormField
                  label="CPF"
                  placeholder="Apenas números"
                  register={register('cpf')}
                  error={errors.cpf?.message}
                />
              </div>
              
              <div>
                <FormField
                  label="RG"
                  placeholder="RG"
                  register={register('rg')}
                  error={errors.rg?.message}
                />
              </div>
              
              <div>
                <FormField
                  label="Telefone"
                  placeholder="(99) 99999-9999"
                  register={register('telefone')}
                  error={errors.telefone?.message}
                />
              </div>
            </div>
            
            <fieldset className="border border-gray-300 p-4 rounded-md">
              <legend className="text-sm font-medium text-gray-700 px-2">Endereço</legend>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <FormField
                    label="Rua"
                    placeholder="Nome da rua"
                    register={register('endereco.rua')}
                    error={errors.endereco?.rua?.message}
                  />
                </div>
                
                <div>
                  <FormField
                    label="Número"
                    placeholder="Número"
                    register={register('endereco.numero')}
                    error={errors.endereco?.numero?.message}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div>
                  <FormField
                    label="Bairro"
                    placeholder="Bairro"
                    register={register('endereco.bairro')}
                    error={errors.endereco?.bairro?.message}
                  />
                </div>
                
                <div>
                  <FormField
                    label="Cidade"
                    placeholder="Cidade"
                    register={register('endereco.cidade')}
                    error={errors.endereco?.cidade?.message}
                  />
                </div>
              </div>
            </fieldset>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <FormField
                  label="E-mail"
                  placeholder="E-mail corporativo"
                  register={register('email')}
                  error={errors.email?.message}
                />
              </div>
              
              <div>
                <FormField
                  label="Função"
                  type="select"
                  register={register('funcao')}
                  options={[
                    { value: 'Diretor', label: 'Diretor' },
                    { value: 'Auxiliar', label: 'Auxiliar' },
                    { value: 'Estoquista', label: 'Estoquista' },
                  ]}
                  error={errors.funcao?.message}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <FormField
                  label="Login"
                  placeholder="Nome de usuário"
                  register={register('login')}
                  error={errors.login?.message}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Senha</label>
                <div className="relative mt-1">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    {...register('senha')}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                    placeholder="Senha"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 px-3 py-2 text-sm text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? 'Ocultar' : 'Mostrar'}
                  </button>
                </div>
                <p className="text-red-500 text-sm mt-1">{errors.senha?.message}</p>
              </div>
            </div>
            
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
                Cadastrar Funcionário
              </Button>
            </div>
          </form>
        </div>
      </div>
    </MainLayout>
  );
}

