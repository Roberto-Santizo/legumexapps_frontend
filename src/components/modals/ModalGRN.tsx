import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { updateGRN } from "@/api/ReceptionsDocAPI";
import { QueryObserverResult, RefetchOptions, useMutation } from "@tanstack/react-query";
import { BoletaRMP, BoletasRmpPaginate } from "@/types/rmpDocTypes";
import Spinner from "../utilities-components/Spinner";
import Error from "@/components/utilities-components/Error";
import InputComponent from "../form/InputComponent";
import Modal from "../Modal";

type Props = {
    modal: boolean;
    setModal: React.Dispatch<React.SetStateAction<boolean>>;
    boleta: BoletaRMP;
    refetch: (options?: RefetchOptions) => Promise<QueryObserverResult<BoletasRmpPaginate>>;
}

type FormData = {
    grn: string;
}

export default function ModalGRN({ modal, boleta, setModal, refetch }: Props) {

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>();

    const { mutate, isPending } = useMutation({
        mutationFn: updateGRN,
        onError: (error) => {
            toast.error(error.message);
        },
        onSuccess: (data) => {
            toast.success(data);
            setModal(false);
            refetch();
        }
    });

    const onSubmit = async (data: FormData) => mutate({ grn: data.grn, id: boleta.id });

    return (
        <Modal modal={modal} closeModal={() => setModal(false)} title="Ingreso de GRN">
            <form noValidate className="space-y-5 mx-auto p-10" onSubmit={handleSubmit(onSubmit)}>
                <InputComponent<FormData>
                    label="GRN"
                    id="grn"
                    name="grn"
                    placeholder="Ingrese el GRN"
                    register={register}
                    validation={{ required: 'El GRN es obligatorio' }}
                    errors={errors}
                    type={'text'}
                >
                    {errors.grn && <Error>{errors.grn?.message?.toString()}</Error>}
                </InputComponent>

                <button disabled={isPending} className="button bg-indigo-500 hover:bg-indigo-600 w-full">
                    {isPending ? <Spinner /> : <p>Generar GRN</p>}
                </button>
            </form>
        </Modal>
    );
}
