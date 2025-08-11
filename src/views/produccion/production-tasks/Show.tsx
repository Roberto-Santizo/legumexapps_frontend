import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useState } from "react";
import { getFinishedTaskProductionDetails } from "@/api/TaskProductionPlansAPI";
import Spinner from "@/components/utilities-components/Spinner";
import ShowErrorAPI from "@/components/utilities-components/ShowErrorAPI";
import HoverCardDemo from "@/components/ui/HoverCardDemo";
import ModalHistoryChangeOperation from "@/components/modals/ModalHistoryChangeOperation";
import HoverCardNote from "@/components/ui/HoverCardNote";
import ModalTaskProductionTransactionsFormats from "@/components/modals/ModalTaskProductionTransactionsFormats";
import GraphicsPlanSemanal from "../plans/GraphicsPlanSemanal";

export default function Show() {
  const params = useParams();
  const task_p_id = params.task_p_id!!;

  const [modal, setModal] = useState<boolean>(false);
  const [modalFormatsBodega, setModalFormatsBodega] = useState<boolean>(false);

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
          <CardTitle className="text-2xl font-semibold flex justify-between">Información de la Tarea</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6 text-md text-gray-700">
          <div className="flex flex-col">
            <p className="font-medium"><strong>Linea:</strong> {task_details.line}</p>
            <p className="font-medium"><strong>SKU:</strong> {task_details.sku}</p>
            <p className="font-medium"><strong>Producto:</strong> {task_details.sku_description}</p>
          </div>
          <div className="flex flex-col">
            <p className="font-medium"><strong>Libras Planificadas:</strong> {task_details.total_lbs}</p>
            <p className="font-medium"><strong>Libras Producidas:</strong> {task_details.total_lbs_produced}</p>
            <p className="font-medium"><strong>Libras Basculadas:</strong> {task_details.total_lbs_bascula}</p>
            <p className="font-medium"><strong>Destino:</strong> {task_details.destination}</p>
          </div>
          <div className="flex flex-col">
            <p className="font-medium"><strong>Fecha de Inicio:</strong> {task_details.start_date}</p>
            <p className="font-medium"><strong>Fecha Final:</strong> {task_details.end_date}</p>
            {!task_details.is_minimum_require && (
              <HoverCardNote note={task_details.note} />

            )}
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
            {task_details.timeouts.length === 0 ? (
              <TableBody>
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-lg">No hay tiempos muertos registrados</TableCell>
                </TableRow>
              </TableBody>
            ) : (
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
            )}

          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Empleados Asignados</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-full p-2 h-96 overflow-y-scroll scrollbar-hide">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Código</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Posición</TableHead>
                  <TableHead>Cambios</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {task_details.employees.map(employee => (
                  <HoverCardDemo key={employee.id} employee={employee} />
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Mermas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-full p-2 h-96 overflow-y-scroll scrollbar-hide">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead>Lote</TableHead>
                  <TableHead>Cantidad</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {task_details.wastages.map(wastage => (
                  <TableRow className="hover:bg-gray-100 transition-all">
                    <TableCell>{wastage.item}</TableCell>
                    <TableCell>{wastage.lote}</TableCell>
                    <TableCell>{wastage.quantity}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between mt-4 gap-5">
        <button className="button bg-indigo-500 hover:bg-indigo-600" onClick={() => setModal(true)}>
          Historial de Cambios
        </button>

        <button className="button bg-indigo-500 hover:bg-indigo-600" onClick={() => setModalFormatsBodega(true)}>
          Formatos Bodega Empaque
        </button>
      </div>

      <div className="mt-6">
        <GraphicsPlanSemanal graphData={task_details.summary} />
      </div>

      <ModalHistoryChangeOperation modal={modal} setModal={setModal} changes={task_details.history_operation_date} />

      <ModalTaskProductionTransactionsFormats open={modalFormatsBodega} setOpen={setModalFormatsBodega} task={task_details} />
    </div>
  );
}