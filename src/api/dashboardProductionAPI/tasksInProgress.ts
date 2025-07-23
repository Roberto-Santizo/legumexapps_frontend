import clienteAxios from "@/config/axios";
import {DashboardProductionResponseSchema,type DashboardProduction} from "@/utils/utilsProductionDashboard/tasksInProgress";


export async function tasksInProgress(): Promise<DashboardProduction[]> {
  try {
    const url = "/api/dashboard/production/in-progress";
    const { data } = await clienteAxios(url);

    const result = DashboardProductionResponseSchema.safeParse(data);

    if (result.success) {
      return result.data.data; 
    } else {
      console.error(" Error en validación Zod:", result.error.format());
      throw new Error("Datos no válidos en el esquema");
    }
  } catch (error) {
    console.error(" Error al consumir taskReport:", error);
    throw error;
  }
}
