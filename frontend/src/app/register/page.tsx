'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Video } from 'lucide-react';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { useAuth } from '../../contexts/AuthContext';
import { api } from '../../services/api';

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await api.post('/auth/register', {
        username,
        email,
        password,
      });
      login(response.data.token, response.data.user);
      router.push('/');
    } catch (err: any) {
      console.error('Register error:', err);
      const msg = err.response?.data?.error || err.response?.data?.message || err.message || 'Erro ao realizar cadastro';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 dark:bg-slate-950">
      <Card className="w-full max-w-md p-8 shadow-2xl border-slate-200/80 dark:border-slate-800">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-500 to-blue-600 flex items-center justify-center text-white shadow-xl shadow-sky-500/30 mb-3">
            <Video className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">Criar Conta</h2>
          <p className="text-xs text-slate-500 mt-1">Preencha os dados abaixo para se cadastrar</p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label="Nome de usuário"
            type="text"
            placeholder="Seu Apelido"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <Input
            label="E-mail"
            type="email"
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Input
            label="Senha"
            type="password"
            placeholder="Mínimo 6 caracteres"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Button variant="primary" size="lg" type="submit" disabled={isLoading} className="w-full mt-2 font-bold">
            {isLoading ? 'Cadastrando...' : 'Cadastrar'}
          </Button>
        </form>

        <div className="mt-6 text-center text-xs text-slate-500">
          Já possui conta?{' '}
          <Link href="/login" className="font-bold text-sky-500 hover:underline">
            Fazer login
          </Link>
        </div>
      </Card>
    </div>
  );
}
