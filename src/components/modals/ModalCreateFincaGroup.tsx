import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import Modal from "../Modal";
import InputComponent from "../form/InputComponent";
import Error from "../utilities-components/Error";
import Spinner from "../utilities-components/Spinner";
import InputSelectComponent from "../form/InputSelectComponent";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFincaGroup } from "@/api/TasksWeeklyPlanAPI";
import { toast } from "react-toastify";

export type DraftFincaGroup = {
    finca_id: number;
    lote_id: number;
    code: string;
}

export default function ModalCreateFincaGroup({ lotes }: { lotes: { value: string; label: string }[] }) {
    const params = useParams();
    const fincaId = params.finca_id!;
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const modal = queryParams.get('createGroup');
    const open = modal ? true : false;
    const navigate = useNavigate();

    const queryClient = useQueryClient();

    const {
        handleSubmit,
        register,
        reset,
        formState: { errors }
    } = useForm<DraftFincaGroup>();

    const handleCloseModal = () => {
        navigate(location.pathname);
    }

    const { mutate, isPending } = useMutation({
        mutationFn: createFincaGroup,
        onError: (error) => {
            toast.error(error.message);
        },
        onSuccess: (data) => {
            toast.success(data);
            queryClient.invalidateQueries({ queryKey: ['getFincaGroups', fincaId] })
            handleCloseModal();
            reset();
        }
    });

    const onSubmit = (data: DraftFincaGroup) => {
        data.finca_id = +fincaId;
        mutate(data);
    }

    return (
        <Modal modal={open} closeModal={() => handleCloseModal()} title="Crear Grupo">
            <div className="flex items-center justify-center">
                <div className="w-full  bg-white shadow-xl rounded-2xl p-10">
                    <form
                        className="space-y-5 mx-auto"
                        onSubmit={handleSubmit(onSubmit)}
                    >
                        <InputComponent<DraftFincaGroup>
                            label="Código del Grupo"
                            id="code"
                            name="code"
                            placeholder="Código del grupo"
                            register={register}
                            validation={{ required: 'El código del grupo es requerido' }}
                            errors={errors}
                            type={'text'}
                        >
                            {errors.code && <Error>{errors.code?.message?.toString()}</Error>}
                        </InputComponent>

                        <InputSelectComponent<DraftFincaGroup>
                            label="Lote"
                            id="lote_id"
                            name="lote_id"
                            options={lotes}
                            register={register}
                            validation={{ required: 'El lote es obligatario' }}
                            errors={errors}
                        >
                            {errors.lote_id && <Error>{errors.lote_id?.message?.toString()}</Error>}
                        </InputSelectComponent>

                        <button disabled={isPending} className="button bg-indigo-500 hover:bg-indigo-600 w-full mt-5">
                            {isPending ? <Spinner /> : <p>Crear Grupo</p>}
                        </button>
                    </form>
                </div>
            </div>
        </Modal>
    )
}
