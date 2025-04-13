import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import bcrypt from 'bcryptjs';
import FormField from '../components/FormField';
import Button from "../components/Button";

const schema = z.object({
  matricula: z.string().min(1, 'Obrigatório'),
  nome: z.string().min(3, 'Nome muito curto'),
  cpf: z.string().regex(/^\d{11}$/, 'CPF inválido'),
  rg: z.string().min(5, 'RG inválido'),
  telefone: z.string().min(14, 'Telefone inválido'),
  endereco: z.object({
    rua: z.string(),
    numero: z.string(),
    bairro: z.string(),
    cidade: z.string(),
  }),
  email: z.string().email('E-mail inválido'),
  funcao: z.enum(['Diretor', 'Auxiliar', 'Estoquista']),
  login: z.string().min(3),
  senha: z.string().min(6),
});

export default function CadastroFuncionario() {
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (data) => {
    const senhaCriptografada = await bcrypt.hash(data.senha, 10);
    const payload = {
      ...data,
      senha: senhaCriptografada,
    };
    console.log('Dados prontos para envio:', payload);
  };

  return (
    <div className="container mx-auto p-8">
      <h2 className="text-3xl font-bold mb-6 text-center">Cadastro de Funcionário</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 bg-white p-6 rounded-lg shadow-md">
        <FormField
          label="Matrícula"
          placeholder="Matrícula"
          register={register('matricula')}
          error={errors.matricula?.message}
        />
        <FormField
          label="Nome completo"
          placeholder="Nome completo"
          register={register('nome')}
          error={errors.nome?.message}
        />
        <FormField
          label="CPF"
          placeholder="CPF"
          register={register('cpf')}
          error={errors.cpf?.message}
        />
        <FormField
          label="RG"
          placeholder="RG"
          register={register('rg')}
          error={errors.rg?.message}
        />
        <FormField
          label="Telefone"
          placeholder="(99) 99999-9999"
          register={register('telefone')}
          error={errors.telefone?.message}
        />
        <fieldset className="border border-gray-300 p-4 rounded-md">
          <legend className="text-sm font-medium text-gray-700">Endereço</legend>
          <FormField
            label="Rua"
            placeholder="Rua"
            register={register('endereco.rua')}
          />
          <FormField
            label="Número"
            placeholder="Número"
            register={register('endereco.numero')}
          />
          <FormField
            label="Bairro"
            placeholder="Bairro"
            register={register('endereco.bairro')}
          />
          <FormField
            label="Cidade"
            placeholder="Cidade"
            register={register('endereco.cidade')}
          />
        </fieldset>
        <FormField
          label="E-mail"
          placeholder="E-mail"
          register={register('email')}
          error={errors.email?.message}
        />
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
          className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600"
        />
        <FormField
          label="Login"
          placeholder="Login"
          register={register('login')}
        />
        <div>
          <label className="block text-sm font-medium text-gray-700">Senha</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              {...register('senha')}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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
        <Button type="submit" variant="primary">
          Cadastrar
        </Button>
      </form>
    </div>
  );
}

