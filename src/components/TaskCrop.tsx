import { TaskCropWeeklyPlan } from "../types";
import { useParams } from "react-router-dom";
import TaskLabel from "./TaskLabel";
import { Grid2X2Plus, SquarePlusIcon } from "lucide-react";

type TaskCropProps = {
  task: TaskCropWeeklyPlan;
};

export default function TaskCrop({ task }: TaskCropProps) {
  const { weekly_plan_id } = useParams();

  return (
    <div className="grid grid-cols-6 shadow-xl p-10 text-xl">
      <div className="col-span-5">
        <TaskLabel label={'ID'} text={task.id} />
        <TaskLabel label={'TAREA'} text={task.task} />
        <TaskLabel label={'CULTIVO'} text={task.cultivo} />
      </div>

      <div className="col-start-7 space-y-5">
        {!task.assigment_today && (
          <SquarePlusIcon
            className="cursor-pointer hover:text-gray-400"
          />
        )}

        {task.finished_assigment_today && (
          <Grid2X2Plus className="cursor-pointer hover:text-gray-500"/>
        )}
      </div>
    </div>
  );
}
