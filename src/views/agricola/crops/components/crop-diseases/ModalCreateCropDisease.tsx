import { createCropDisease } from "../../api/api";
import { DraftCropDisease } from "../../types";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNotification } from "@/core/notifications/NotificationContext";
import Error from "@/components/utilities-components/Error";
import InputComponent from "@/components/form/InputComponent";
import Modal from "@/components/Modal";
import Spinner from "@/components/utilities-components/Spinner";

export default function ModalCreateCropDisease() {
    const location = useLocation();
    const navigate = useNavigate();
    const params = useParams();
    const notify = useNotification();
    const queryClient = useQueryClient();

    const id = params.id!;
    const queryParams = new URLSearchParams(location.search);
    const modal = queryParams.get('create')!;
    const show = modal ? true : false;

    const handleCloseModal = () => {
        navigate(location.pathname);
    }

    const {
        mutate, isPending
    } = useMutation({
        mutationFn: createCropDisease,
        onError: (error) => {
            notify.error(error.message);
        },
        onSuccess: (message) => {
            notify.success(message!);
            handleCloseModal();
            queryClient.invalidateQueries({ queryKey: ['getCropDiseases', id] });
        }
    });

    const {
        handleSubmit,
        register,
        formState: { errors }
    } = useForm<DraftCropDisease>();

    const onSubmit = (data: DraftCropDisease) => {
        data.crop_id = +id;
        mutate(data);
    }
    return (
        <Modal modal={show} closeModal={() => handleCloseModal()} title="Crear Enfermedad de Cultivo">
            <div className="p-10">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <InputComponent<DraftCropDisease>
                        label="Nombre"
                        id="name"
                        name="name"
                        placeholder="Nombre"
                        register={register}
                        validation={{ required: 'El campo es obligatorio' }}
                        errors={errors}
                        type={'text'}
                    >
                        {errors.name && <Error>{errors.name?.message?.toString()}</Error>}
                    </InputComponent>
                    <InputComponent<DraftCropDisease>
                        label="Semana"
                        id="week"
                        name="week"
                        placeholder="Semana"
                        register={register}
                        validation={{ required: 'El campo es obligatorio', min: { value: 1, message: 'El minimo valor de semana es 1' } }}
                        errors={errors}
                        type={'number'}
                    >
                        {errors.week && <Error>{errors.week?.message?.toString()}</Error>}
                    </InputComponent>

                    <button disabled={isPending} type="submit" className="button bg-indigo-500 hover:bg-indigo-800 w-full">
                        {isPending ? <Spinner /> : <p>Crear</p>}
                    </button>
                </form>
            </div>
        </Modal>
    )
}
