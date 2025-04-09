import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllInsumos, Insumo } from "@/api/InsumosAPI";
import { Controller, useForm } from "react-hook-form";
import { DraftSelectedInsumo } from "views/agricola/planes-semanales/CreateTareaLote";
import Select from "react-select";
import Error from "../utilities-components/Error";
import Modal from "../Modal";

type Props = {
    open: boolean,
    setOpen: Dispatch<SetStateAction<boolean>>;
    setSelectedInsumos: Dispatch<React.SetStateAction<DraftSelectedInsumo[]>>;
};

export default function ModalAddInsumo({ open, setOpen, setSelectedInsumos }: Props) {
    const [insumos, setInsumos] = useState<Insumo[]>([]);
    const { data } = useQuery({
        queryKey: ["getAllInsumos"],
        queryFn: getAllInsumos,
    });

    useEffect(() => {
        if (data) {
            setInsumos(data);
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
                    <div>
                        <label className="block text-sm font-medium text-gray-700" htmlFor="insumo_id">
                            Insumo:
                        </label>
                        <Controller
                            name="insumo_id"
                            control={control}
                            rules={{ required: "Seleccione un insumo" }}
                            render={({ field }) => (
                                <Select
                                    {...field}
                                    options={insumosOptions}
                                    id="insumo_id"
                                    placeholder="--SELECCIONE UNA OPCIÓN--"
                                    className="mt-1 border border-gray-300 rounded-md shadow-sm"
                                    onChange={(selected) => field.onChange(selected?.value)}
                                    value={insumosOptions.find((option) => option.value === field.value)}
                                />
                            )}
                        />
                        {errors.insumo_id && <Error>{errors.insumo_id?.message?.toString()}</Error>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700" htmlFor="quantity">
                            Cantidad:
                        </label>
                        <input
                            id="quantity"
                            type="number"
                            placeholder="Cantidad del insumo"
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                            {...register("quantity", { required: "Ingrese una cantidad" })}
                        />
                        {errors.quantity && <Error>{errors.quantity?.message?.toString()}</Error>}
                    </div>

                    <button className="button bg-indigo-500 hover:bg-indigo-600 w-full">
                        <p>Agregar Insumo</p>
                    </button>
                </form>
            </div>
        </Modal>

    );
}
