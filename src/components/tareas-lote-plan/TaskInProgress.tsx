import { Card, CardContent, Typography, IconButton, Tooltip, Box, Stack } from "@mui/material";
import { Link } from "react-router-dom";
import { Clock, PlayCircle, Eye, CheckCircle } from "lucide-react";
import { toast } from "react-toastify";
import { closeTask } from "@/api/TasksWeeklyPlanAPI";
import { QueryObserverResult, useMutation } from "@tanstack/react-query";
import { TaskInProgress } from "@/api/DashboardAgricolaAPI";
import Swal from "sweetalert2";
import { TaskWeeklyPlan } from "@/types/taskWeeklyPlanTypes";

type Props = {
  task: TaskInProgress;
  refetch: () => Promise<QueryObserverResult<TaskInProgress[]>>
};

export default function TaskCard({ task, refetch }: Props) {
  const url = `/planes-semanales/tareas-lote/informacion/${task.id}`;

  const { mutate } = useMutation({
    mutationFn: closeTask,
    onError: () => {
      toast.error('Hubo un error al traer la información');
    },
    onSuccess: () => {
      refetch();
      toast.success("Tarea Cerrada Correctamente");
    }
  });

  const handleCloseTask = async (idTask: TaskWeeklyPlan["id"]) => {
    if (task.has_insumos) {
      Swal.fire({
        icon: "error",
        title: "¡La tarea cuenta con insumos!",
        text: "Para poder cerrar la tarea ve a la seccion de tareas en planes semanales",
      });
    } else {
      Swal.fire({
        title: "¿Deseas cerrar esta tarea?",
        showCancelButton: true,
        cancelButtonText: 'CANCELAR',
        confirmButtonText: "CERRAR TAREA",
        confirmButtonColor: 'red'
      }).then(async (result) => {
        if (result.isConfirmed) {
          mutate(idTask)
        }
      });
    }
  };

  return (
    <Card sx={{ boxShadow: 3, "&:hover": { boxShadow: 6 }, borderRadius: 2 }}>
      <CardContent>
        <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
          <Stack direction="row" alignItems="center" spacing={1}>
            {task.paused ? (
              <PlayCircle className="text-green-500 w-5 h-5" />
            ) : (
              <Clock className="text-orange-500 w-5 h-5" />
            )}
            <Typography variant="body1" fontWeight="medium" color="text.primary">
              {task.task} - {task.finca} - {task.lote} - Semana {task.week}
            </Typography>
          </Stack>

          <Typography variant="body2" color="text.secondary">
            Empleados:{" "}
            <strong>
              {task.assigned_employees}
              {task.total_employees ? ` / ${task.total_employees}` : ""}
            </strong>
          </Typography>

          <Box>
            <Tooltip title="Completar tarea">
              <IconButton color="success" onClick={() => handleCloseTask(task.id)}>
                <CheckCircle className="text-green-600 w-5 h-5" />
              </IconButton>
            </Tooltip>

            <Tooltip title="Ver detalles">
              <IconButton color="primary" component={Link} to={url} target="_blank">
                <Eye className="text-blue-600 w-5 h-5" />
              </IconButton>
            </Tooltip>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}
