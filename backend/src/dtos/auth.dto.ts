import { z } from 'zod';

export const RegisterDtoSchema = z.object({
  email: z.string().email('Format de email inválido'),
  username: z.string().min(3, 'Nome de usuário deve ter pelo menos 3 caracteres'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
  interests: z.array(z.string()).optional(),
});

export const LoginDtoSchema = z.object({
  email: z.string().email('Format de email inválido'),
  password: z.string().min(1, 'Senha é obrigatória'),
});

export const GuestAuthDtoSchema = z.object({
  username: z.string().optional(),
  interests: z.array(z.string()).optional(),
});

export type RegisterDto = z.infer<typeof RegisterDtoSchema>;
export type LoginDto = z.infer<typeof LoginDtoSchema>;
export type GuestAuthDto = z.infer<typeof GuestAuthDtoSchema>;
