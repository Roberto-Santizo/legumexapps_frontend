import clienteAxios from "@/config/axios";
import { DashboardProductionResponseSchema, DashboardProduction } from '@/utils/utilsProductionDashboard/taskReport'


export async function taskReport(): Promise<DashboardProduction[]> {
  try {
    const url = '/api/dashboard/production/finished-tasks-per-line';
    const { data } = await clienteAxios(url);
    const result = DashboardProductionResponseSchema.safeParse(data);

    if (result.success) {
      return result.data; 
    } else {
      console.error(result.error);
      throw new Error("Datos no válidos");
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
}

