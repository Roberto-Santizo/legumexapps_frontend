import { Card, CardContent, Typography, IconButton, Tooltip, Box, Stack } from "@mui/material";
import { Link } from "react-router-dom";
import { Clock, Eye } from "lucide-react";
import { TaskCropInProgress } from "../types";

type TaskCropProps = {
  task: TaskCropInProgress;
};

export default function TaskCropInProgressComponent({ task }: TaskCropProps) {
  const url = `/planes-semanales/tareas-cosecha-lote/informacion/${task.id}`;

  return (
    <Card sx={{ boxShadow: 3, "&:hover": { boxShadow: 6 }, borderRadius: 2 }}>
      <CardContent>
        <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Clock className="text-orange-500 w-5 h-5" />
            <Typography variant="body1" fontWeight="medium" color="text.primary">
              {task.task} - {task.finca} - {task.lote} - Semana {task.week}
            </Typography>
          </Stack>

          <Box>
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
