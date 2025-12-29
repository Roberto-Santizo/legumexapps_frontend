import { useParams } from "react-router-dom";
import { getTasksCrop } from "@/api/TaskCropWeeklyPlanAPI";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import Spinner from "@/components/utilities-components/Spinner";
import ShowErrorAPI from "@/components/utilities-components/ShowErrorAPI";
import TaskCrop from "@/components/tareas-lote-plan/TaskCrop";
import ModalTomaLibras from "@/components/modals/ModalTomaLibras";


export default function Index() {
  const params = useParams();
  const cdp_id = params.cdp_id!;
  const weekly_plan_id = params.weekly_plan_id!;

  const [id, setId] = useState<string>('');
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const { data: tasksCrops, isLoading, isError, refetch } = useQuery({
    queryKey: ['getTasksCrop', cdp_id, weekly_plan_id], queryFn: () => getTasksCrop(cdp_id, weekly_plan_id)
  });

  if (isLoading) return <Spinner />
  if (isError) return <ShowErrorAPI />
  if (tasksCrops) return (
    <>
      <div className="flex flex-col gap-10 mt-10">
        {tasksCrops.data.map(task => <TaskCrop key={task.id} task={task} refetch={refetch} setId={setId} setIsOpen={setIsOpen} />)}
      </div>

      {isOpen && (
        <ModalTomaLibras isOpen={isOpen} setIsOpen={setIsOpen} id={id} refetch={refetch} />
      )}
    </>
  )
}
