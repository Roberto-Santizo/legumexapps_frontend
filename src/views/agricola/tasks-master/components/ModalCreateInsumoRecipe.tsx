import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { DraftInsumoRecipe } from "../types";
import { useQuery } from "@tanstack/react-query";
import { getInsumos } from "@/api/InsumosAPI";
import { Dispatch, SetStateAction } from "react";
import Modal from "@/components/Modal";
import Spinner from "@/components/utilities-components/Spinner";
import InputComponent from "@/components/form/InputComponent";
import Error from "@/components/utilities-components/Error";
import InputSelectSearchComponent from "@/components/form/InputSelectSearchComponent";

interface Props {
    setInsumos: Dispatch<SetStateAction<DraftInsumoRecipe[]>>;
    added_insumos: DraftInsumoRecipe[];
}

export default function ModalCreateInsumoRecipe({ setInsumos, added_insumos }: Props) {
    const queryParams = new URLSearchParams(location.search);
    const flag = queryParams.get('addInsumo')!;
    const show = flag ? true : false;
    const navigate = useNavigate();

    const { data: insumos } = useQuery({
        queryKey: ['getInsumos'],
        queryFn: () => getInsumos({ paginated: '', currentPage: 1, filters: { code: '', name: '' } })
    });

    const insumosOptions = insumos?.data.map((insumo) => {
        return { value: insumo.id, label: `${insumo.name} - ${insumo.code}` }
    });

    const handleCloseModal = () => {
        navigate(location.pathname);
    }

    const {
        handleSubmit,
        register,
        formState: { errors },
        control,
        reset
    } = useForm<DraftInsumoRecipe>();

    const onSubmit = (data: DraftInsumoRecipe) => {
        const exists = added_insumos.findIndex((item) => item.insumo_id == data.insumo_id);
        data.name = insumos?.data.filter((insumo) => insumo.id == data.insumo_id.toString())[0].name ?? '';

        if (exists < 0) {
            setInsumos((prev) => [...prev, data]);
        } else {
            setInsumos(
                added_insumos.map(insumo => (insumo.insumo_id == data.insumo_id) ? data : insumo)
            );
        }
        reset();
        handleCloseModal();
    }

    return (
        <Modal modal={show} closeModal={() => handleCloseModal()} title="Receta de Insumo" >
            <div className="p-5">
                <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
                    <InputSelectSearchComponent<DraftInsumoRecipe>
                        label="Insumo"
                        id="insumo_id"
                        name="insumo_id"
                        options={insumosOptions ?? []}
                        control={control}
                        rules={{ required: 'La finca es requerida' }}
                        errors={errors}
                    >
                        {errors.insumo_id && <Error>{errors.insumo_id?.message?.toString()}</Error>}
                    </InputSelectSearchComponent>

                    <InputComponent<DraftInsumoRecipe>
                        label="Cantidad"
                        id="quantity"
                        name="quantity"
                        placeholder="Cantidad asignada"
                        register={register}
                        validation={{ required: 'El campo es obligatorio' }}
                        errors={errors}
                        type={'number'}
                    >
                        {errors.quantity && <Error>{errors.quantity?.message?.toString()}</Error>}
                    </InputComponent>

                    <button disabled={false} className="button bg-indigo-500 hover:bg-indigo-600 w-full">
                        {false ? <Spinner /> : <p>Crear</p>}
                    </button>
                </form>
            </div>
        </Modal >
    )
}
