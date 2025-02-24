import { z } from 'zod';

export const Finca = z.object({
    id: z.string(),
    name: z.string(),
    code: z.string(),
    terminal_id: z.number()
});


export const FincasSchema = z.object({
    data: z.array(Finca)
});