import { createCropDiseaseSymptom, getCropParts } from "../../api/api";
import { DraftCropDiseaseSymptom } from "../../types";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNotification } from "@/core/notifications/NotificationContext";
import Error from "@/components/utilities-components/Error";
import InputComponent from "@/components/form/InputComponent";
import InputSelectSearchComponent from '../../../../../components/form/InputSelectSearchComponent';
import Modal from "@/components/Modal";
import Spinner from "@/components/utilities-components/Spinner";

export default function ModalAddSymptom() {
    const location = useLocation();
    const navigate = useNavigate();
    const params = useParams();
    const notify = useNotification();
    const queryClient = useQueryClient();
    const diseaseId = params.diseaseId!;

    const id = params.id!;
    const queryParams = new URLSearchParams(location.search);
    const modal = queryParams.get('addSymptom')!;
    const show = modal ? true : false;

    const {
        handleSubmit,
        register,
        formState: { errors },
        reset,
        control
    } = useForm<DraftCropDiseaseSymptom>();


    const handleCloseModal = () => {
        navigate(location.pathname);
    }

    const { mutate, isPending } = useMutation({
        mutationFn: createCropDiseaseSymptom,
        onError: (error) => {
            notify.error(error.message);
        },
        onSuccess: (message) => {
            notify.success(message!);
            queryClient.invalidateQueries({ queryKey: ['getCropDiseaseSymptonsById', diseaseId] })
            reset();
            handleCloseModal();
        }
    });


    const { data } = useQuery({
        queryKey: ['getCropParts', id],
        queryFn: () => getCropParts(+id)
    });

    const parts = data?.map((part) => ({
        value: `${part.id}`,
        label: `${part.name}`,
    }));

    const onSubmit = (data: DraftCropDiseaseSymptom) => {
        data.crop_disease_id = +diseaseId;
        mutate(data);
    }

    if (parts) return (
        <Modal modal={show} closeModal={() => handleCloseModal()} title="Crear Sintoma de Enfermedad">
            <div className="p-10">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <InputComponent<DraftCropDiseaseSymptom>
                        label="Sintoma"
                        id="name"
                        name="symptom"
                        placeholder="Sintoma"
                        register={register}
                        validation={{ required: 'El campo es obligatorio' }}
                        errors={errors}
                        type={'text'}
                    >
                        {errors.symptom && <Error>{errors.symptom?.message?.toString()}</Error>}
                    </InputComponent>

                    <InputSelectSearchComponent<DraftCropDiseaseSymptom>
                        label="Parte de la planta"
                        id="crop_part_id"
                        name="crop_part_id"
                        options={parts}
                        control={control}
                        rules={{ required: 'El campo es obligatorio' }}
                        errors={errors}
                    >
                        {errors.crop_disease_id && <Error>{errors.crop_disease_id?.message?.toString()}</Error>}
                    </InputSelectSearchComponent>

                    <button disabled={isPending} className="w-full button bg-indigo-600 hover:bg-indigo-800">
                        {isPending ? <Spinner /> : <p>Crear Sintoma</p>}
                    </button>
                </form>
            </div>
        </Modal>
    )
}
