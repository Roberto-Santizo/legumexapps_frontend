import { getFinishedTaskProductionDetails } from "@/api/WeeklyProductionPlanAPI";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Spinner from "@/components/Spinner";
import ShowErrorAPI from "@/components/ShowErrorAPI";
import GraphicsPlanSemanal from "./GraphicsPlanSemanal";
import HoverCardDemo from "@/components/ui/HoverCardDemo";

export default function TareaProduccionDetails() {
  const params = useParams();
  const task_p_id = params.task_p_id!!;

  const { data: task_details, isLoading, isError } = useQuery({
    queryKey: ['getFinishedTaskProductionDetails', task_p_id],
    queryFn: () => getFinishedTaskProductionDetails(task_p_id)
  });

  if (isLoading) return <Spinner />;
  if (isError) return <ShowErrorAPI />;

  if (task_details) return (
    <div className="p-6 space-y-6">
      <h2 className="text-4xl font-bold">Detalles de Producción</h2>

      <Card className="bg-white shadow-lg rounded-lg overflow-hidden">
        <CardHeader className="bg-blue-600 text-white p-4">
          <CardTitle className="text-2xl font-semibold">Información de la Tarea</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6 text-md text-gray-700">
          <div className="flex flex-col">
            <p className="font-medium"><strong>Linea:</strong> {task_details.line}</p>
            <p className="font-medium"><strong>SKU:</strong> {task_details.sku}</p>
            <p className="font-medium"><strong>Producto:</strong> {task_details.sku_description}</p>
          </div>
          <div className="flex flex-col">
            <p className="font-medium"><strong>Libras Planificadas:</strong> {task_details.total_lbs_produced}</p>
            <p className="font-medium"><strong>Libras Producidas:</strong> {task_details.total_lbs_produced}</p>
            <p className="font-medium"><strong>Libras Basculadas:</strong> {task_details.total_lbs_bascula}</p>
            <p className="font-medium"><strong>Destino:</strong> {task_details.destination}</p>
          </div>
          <div className="flex flex-col">
            <p className="font-medium"><strong>Fecha de Inicio:</strong> {task_details.start_date}</p>
            <p className="font-medium"><strong>Fecha Final:</strong> {task_details.end_date}</p>
          </div>
        </CardContent>
      </Card>


      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Tiempos Muertos</CardTitle>
        </CardHeader>
        <CardContent className="overflow-auto max-h-64">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tiempo Muerto</TableHead>
                <TableHead>Fecha de Inicio</TableHead>
                <TableHead>Fecha Final</TableHead>
                <TableHead>Horas Totales</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {task_details.timeouts.map(timeout => (
                <TableRow key={timeout.id}>
                  <TableCell>{timeout.name}</TableCell>
                  <TableCell>{timeout.start_date}</TableCell>
                  <TableCell>{timeout.end_date ?? 'SIN CIERRE'}</TableCell>
                  <TableCell>{timeout.total_hours ?? 'SIN HORAS'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Empleados Asignados</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Código</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Posición</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {task_details.employees.map(employee => (
                <HoverCardDemo employee={employee}/> 
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="mt-6">
        <GraphicsPlanSemanal graphData={task_details.summary} />
      </div>
    </div>
  );
}

// onMouseEnter={() => alert(employee.id)}