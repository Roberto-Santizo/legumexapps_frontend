import {  z } from 'zod';


export const CDPSchema = z.object({
    id: z.string(),
    cdp: z.string()
});

export const CDPsSchema = z.object({
    data: z.array(CDPSchema)
});



