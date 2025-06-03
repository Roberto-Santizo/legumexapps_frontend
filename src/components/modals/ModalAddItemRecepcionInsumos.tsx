import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { getInsumos, Insumo } from "@/api/InsumosAPI";
import { useQuery } from "@tanstack/react-query";
import { DraftItemRecepcionInsumos } from "@/views/bodega/recepcion-insumos/CrearRecepcionInsumos";
import { FiltersInsumosInitialValues } from "@/views/agricola/insumos/IndexInsumos";
import { useForm } from "react-hook-form";
import Modal from "../Modal";
import Spinner from "../utilities-components/Spinner";
import Error from "../utilities-components/Error";
import InputSelectSearchComponent from "../form/InputSelectSearchComponent";
import InputComponent from "../form/InputComponent";

type Props = {
    modal: boolean;
    setModal: Dispatch<SetStateAction<boolean>>;
    setItems: Dispatch<SetStateAction<DraftItemRecepcionInsumos[]>>;
    items: DraftItemRecepcionInsumos[];
}

export default function ModalAddItemRecepcionInsumos({ modal, setModal, setItems, items }: Props) {
    const [insumos, setInsumos] = useState<Insumo[]>([]);
    const { data, isPending } = useQuery({
        queryKey: ["getInsumos"],
        queryFn: () => getInsumos({currentPage: 1, filters: FiltersInsumosInitialValues ,paginated:''}),
    });

    useEffect(() => {
        if (data) {
            setInsumos(data.data);
        }
    }, [data]);

    const insumosOptions = insumos.map((insumo) => ({
        value: insumo.id,
        label: `${insumo.code} | ${insumo.name} | ${insumo.measure}`,
    }));

    const {
        handleSubmit,
        register,
        control,
        reset,
        formState: { errors }
    } = useForm<DraftItemRecepcionInsumos>();

    const handleClose = () => {
        setModal(false);
        reset();
    }

    const onSubmit = (data: DraftItemRecepcionInsumos) => {
        const item = items.some(item => item.insumo_id === data.insumo_id);
        if (item) {
            setItems((prev) =>
                prev.map(item =>
                    item.insumo_id === data.insumo_id
                        ? { ...item, ...data }
                        : item
                )
            );
        } else {
            const item = insumos.filter(item => item.id === data.insumo_id)[0];
            data.name = item.name;
            setItems((prev) => [...prev, data]);
        }
        handleClose();
    }

    return (
        <Modal modal={modal} closeModal={() => handleClose()} title="Registrar Insumo">
            {isPending && <Spinner />}
            <form noValidate className="space-y-5 mx-auto p-10" onSubmit={handleSubmit(onSubmit)}>
                <InputSelectSearchComponent<DraftItemRecepcionInsumos>
                    label="Insumo"
                    id="insumo_id"
                    name="insumo_id"
                    options={insumosOptions}
                    control={control}
                    rules={{ required: 'El insumo es requerido' }}
                    errors={errors}
                >
                    {errors.insumo_id && <Error>{errors.insumo_id?.message?.toString()}</Error>}
                </InputSelectSearchComponent>

                <InputComponent<DraftItemRecepcionInsumos>
                    label="Unidades"
                    id="units"
                    name="units"
                    placeholder="Unidades de insumo ingresados"
                    register={register}
                    validation={{ required: 'Las unidades totales son requeridas' }}
                    errors={errors}
                    type={'number'}
                >
                    {errors.units && <Error>{errors.units?.message?.toString()}</Error>}
                </InputComponent>

                <button className="button bg-indigo-500 hover:bg-indigo-600 w-full">
                    <p>Agregar</p>
                </button>
            </form>
        </Modal>
    )
}
