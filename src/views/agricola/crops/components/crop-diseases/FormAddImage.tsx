import { addCropDiseaseImage } from "../../api/api";
import { DraftCropDiseaseImage } from "../../types";
import { fileToBase64 } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNotification } from "@/core/notifications/NotificationContext";
import { useParams } from "react-router-dom";
import Error from "@/components/utilities-components/Error";
import InputComponent from "@/components/form/InputComponent";
import Spinner from "@/components/utilities-components/Spinner";

export default function FormAddImage() {
    const notify = useNotification();
    const params = useParams();
    const queryClient = useQueryClient();

    const diseaseId = params.diseaseId!;

    const {
        handleSubmit,
        register,
        formState: { errors },
        reset
    } = useForm<DraftCropDiseaseImage>();

    const { mutate, isPending } = useMutation({
        mutationFn: addCropDiseaseImage,
        onError: (error) => {
            notify.error(error.message);
        },
        onSuccess: (message) => {
            notify.success(message!);
            queryClient.invalidateQueries({ queryKey: ['getCropDiseaseImagesById', diseaseId] });
            reset();
        }
    });


    const onSubmit = async (data: DraftCropDiseaseImage) => {
        const imageBase64 = await fileToBase64(data.image[0]);
        mutate({ id: +diseaseId, image: imageBase64 });
    }
    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
            <InputComponent<DraftCropDiseaseImage>
                label="Imagen"
                id="image"
                name="image"
                placeholder=""
                register={register}
                validation={{ required: 'El campo es obligatorio' }}
                errors={errors}
                type={'file'}
            >
                {errors.image && <Error>{errors.image?.message?.toString()}</Error>}
            </InputComponent>
            <button disabled={isPending} className="button bg-indigo-600 hover:bg-indigo-800 w-full">
                {isPending ? <Spinner /> : <p>Agregar Imagen</p>}
            </button>
        </form>
    )
}
