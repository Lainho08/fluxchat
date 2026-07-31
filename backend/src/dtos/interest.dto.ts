import { z } from 'zod';

export const CreateInterestDtoSchema = z.object({
  name: z.string().min(2, 'Nome do interesse deve ter no mínimo 2 caracteres'),
});

export type CreateInterestDto = z.infer<typeof CreateInterestDtoSchema>;
