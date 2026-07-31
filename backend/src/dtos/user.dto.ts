import { z } from 'zod';

export const UpdateProfileDtoSchema = z.object({
  username: z.string().min(3).optional(),
  avatar: z.string().url().optional(),
  interests: z.array(z.string()).optional(),
});

export type UpdateProfileDto = z.infer<typeof UpdateProfileDtoSchema>;
