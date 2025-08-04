import { filtersDashboardTasksInProgress } from "@/components/dashboard-production/TasksInProgress";
import clienteAxios from "@/config/axios";
import { SummaryLinesTasksShema, TasksProductionDashboardSchema } from "@/utils/dashboardSchemas";
import { isAxiosError } from "axios";

export async function GetTasksProductionInProgress({ filters }: { filters: filtersDashboardTasksInProgress }) {
  try {
    const url = `/api/dashboard/production/in-progress?line=${filters.line}`;
    const { data } = await clienteAxios(url);

    const result = TasksProductionDashboardSchema.safeParse(data);

    if (result.success) {
      return result.data;
    }
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(error.response?.data.msg);
    }
  }
}

export async function GetSummaryTasksPerLine() {
  try {
    const url = '/api/dashboard/production/finished-tasks-per-line';
    const { data } = await clienteAxios(url);
    const result = SummaryLinesTasksShema.safeParse(data);

    if (result.success) {
      return result.data;
    }
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(error.response?.data.msg);
    }
  }
}

export async function GetFinishedTasksProduction() {
  try {
    const url = '/api/dashboard/production/finished-tasks';
    const { data } = await clienteAxios(url);
    const result = TasksProductionDashboardSchema.safeParse(data);

    if (result.success) {
      return result.data;
    }
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(error.response?.data.msg);
    }
  }
}

