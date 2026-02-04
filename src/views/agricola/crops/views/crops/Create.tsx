import { createCrop } from '../../api/api';
import { DraftCrop } from '../../types/index';
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useNotification } from '@/core/notifications/NotificationContext';
import Form from '../../components/crops/Form';
import Spinner from '@/components/utilities-components/Spinner';
import Title from "@/components/shared/Title";

export default function Create() {
  const notify = useNotification();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    handleSubmit,
    register,
    formState: { errors }
  } = useForm<DraftCrop>();

  const { mutate, isPending } = useMutation({
    mutationFn: createCrop,
    onError: (error) => {
      notify.error(error.message);
    },
    onSuccess: (message) => {
      notify.success(message!);
      navigate('/cultivos');
      queryClient.invalidateQueries({ queryKey: ['getCrops'] });
    }
  });

  const onSubmit = (data: DraftCrop) => mutate(data);
  return (
    <div>
      <Title title="Crear Cultivo" size="text-4xl" />

      <form onSubmit={handleSubmit(onSubmit)} className="mt-5 w-2/3 mx-auto space-y-5">

        <Form register={register} errors={errors} />

        <button disabled={isPending} className="button bg-indigo-500 hover:bg-indigo-800 w-full" type="submit">
          {isPending ? <Spinner /> : <p>Crear Cultivo</p>}
        </button>
      </form>
    </div>
  )
}
