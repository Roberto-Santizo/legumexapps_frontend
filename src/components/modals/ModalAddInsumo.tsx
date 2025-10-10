import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { getInsumos } from "@/api/InsumosAPI";
import { useForm } from "react-hook-form";
import { DraftSelectedInsumo } from "@/views/agricola/plans/CreateTareaLote";
import { useQuery } from "@tanstack/react-query";
import { FiltersInsumosInitialValues } from "@/views/agricola/supplies/Index";
import Error from "../utilities-components/Error";
import Modal from "../Modal";
import InputSelectSearchComponent from "../form/InputSelectSearchComponent";
import InputComponent from "../form/InputComponent";
import { Insumo } from "@/types/insumoTypes";

type Props = {
    open: boolean,
    setOpen: Dispatch<SetStateAction<boolean>>;
    setSelectedInsumos: Dispatch<React.SetStateAction<DraftSelectedInsumo[]>>;
};

export default function ModalAddInsumo({ open, setOpen, setSelectedInsumos }: Props) {
    const [insumos, setInsumos] = useState<Insumo[]>([]);

    const { data } = useQuery({
        queryKey: ["getInsumos"],
        queryFn: () => getInsumos({ currentPage: 1, filters: FiltersInsumosInitialValues, paginated: '' }),
    });

    const insumosOptions = insumos.map((insumo) => ({
        value: insumo.id,
        label: `${insumo.code} | ${insumo.name} | ${insumo.measure}`,
    }));

    useEffect(() => {
        if (data) {
            setInsumos(data.data);
        }
    }, [data]);

    const {
        handleSubmit,
        register,
        control,
        formState: { errors },
        reset,
    } = useForm<DraftSelectedInsumo>();

    const onSubmit = (data: DraftSelectedInsumo) => {
        setSelectedInsumos((prevInsumos) => {
            const exists = prevInsumos.some(insumo => insumo.insumo_id === data.insumo_id);
            const insumo_prev = insumos.filter(insumo => insumo.id === data.insumo_id);
            const newInsumo = {
                insumo_id: data.insumo_id,
                quantity: data.quantity,
                name: insumo_prev[0].name,
            }
            if (exists) {
                return prevInsumos.map(insumo =>
                    insumo.insumo_id === newInsumo.insumo_id
                        ? { ...insumo, quantity: String(Number(insumo.quantity) + Number(newInsumo.quantity)) }
                        : insumo
                );
            } else {
                return [...prevInsumos, newInsumo];
            }
        });

        setOpen(false);
        reset();
    };

    return (
        <Modal modal={open} closeModal={() => setOpen(false)} title="Agregar Insumo">
            <div className="p-6 space-y-6">
                <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                    <InputSelectSearchComponent<DraftSelectedInsumo>
                        label="Insumo"
                        id="insumo_id"
                        name="insumo_id"
                        options={insumosOptions}
                        control={control}
                        rules={{ required: 'Seleccione un insumo' }}
                        errors={errors}
                    >
                        {errors.insumo_id && <Error>{errors.insumo_id?.message?.toString()}</Error>}
                    </InputSelectSearchComponent>


                    <InputComponent<DraftSelectedInsumo>
                        label="Cantidad"
                        id="quantity"
                        name="quantity"
                        placeholder="Cantidad a asignar"
                        register={register}
                        validation={{ required: "La cantidad del insumo es obligatoria" }}
                        errors={errors}
                        type={'number'}
                    >
                        {errors.quantity && <Error>{errors.quantity?.message?.toString()}</Error>}
                    </InputComponent>

                    <button className="button bg-indigo-500 hover:bg-indigo-600 w-full">
                        <p>Agregar Insumo</p>
                    </button>
                </form>
            </div>
        </Modal>

    );
}
