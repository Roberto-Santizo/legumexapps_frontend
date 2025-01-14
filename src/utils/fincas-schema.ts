import { z } from 'zod';

export const Finca = z.object({
    id: z.string(),
    name: z.string(),
    code: z.string(),
    terminal_id: z.number()
});


export const Fincas = z.object({
    data: z.array(Finca)
});