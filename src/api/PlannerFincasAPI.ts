import { DraftWeeklyPlansSchema } from "@/schemas/plannerFincasSchemas";
import clienteAxios from "@/config/axios";

export default async function getDraftWeeklyPlans({ page, limit }: { page: number, limit: number }) {
    try {
        const url = '/api/seeding-plan';
        const response = await clienteAxios(url, {
            params: {
                page: page + 1,
                limit
            }
        });

        const result = DraftWeeklyPlansSchema.safeParse(response.data);
        if (result.success) {
            return result.data;
        }
    } catch (error: unknown) {
        throw error;
    }
}