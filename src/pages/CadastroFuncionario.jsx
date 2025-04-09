import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import bcrypt from 'bcryptjs';

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
    <div className="container">
      <h2>Cadastro de Funcionário</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label>Matrícula</label>
        <input {...register('matricula')} />
        <p>{errors.matricula?.message}</p>

        <label>Nome completo</label>
        <input {...register('nome')} />
        <p>{errors.nome?.message}</p>

        <label>CPF</label>
        <input {...register('cpf')} />
        <p>{errors.cpf?.message}</p>

        <label>RG</label>
        <input {...register('rg')} />
        <p>{errors.rg?.message}</p>

        <label>Telefone</label>
        <input {...register('telefone')} placeholder="(99) 99999-9999" />
        <p>{errors.telefone?.message}</p>

        <label>Rua</label>
        <input {...register('endereco.rua')} />

        <label>Número</label>
        <input {...register('endereco.numero')} />

        <label>Bairro</label>
        <input {...register('endereco.bairro')} />

        <label>Cidade</label>
        <input {...register('endereco.cidade')} />

        <label>E-mail</label>
        <input {...register('email')} />
        <p>{errors.email?.message}</p>

        <label>Função</label>
        <select {...register('funcao')}>
          <option value="">Selecione</option>
          <option value="Diretor">Diretor</option>
          <option value="Auxiliar">Auxiliar</option>
          <option value="Estoquista">Estoquista</option>
        </select>

        <label>Login</label>
        <input {...register('login')} />

        <label>Senha</label>
        <div className="password-wrapper">
          <input type={showPassword ? 'text' : 'password'} {...register('senha')} />
          <button type="button" onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? 'Ocultar' : 'Mostrar'}
          </button>
        </div>

        <button type="submit">Cadastrar</button>
      </form>
    </div>
  );
} 

