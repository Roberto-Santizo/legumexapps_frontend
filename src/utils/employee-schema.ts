import { z } from 'zod';

export const EmployeeSchema = z.object({
    emp_id: z.string(),
    name: z.string(),
    code: z.string(),
});


export const EmployeesSchema = z.object({
    data: z.array(EmployeeSchema)
});