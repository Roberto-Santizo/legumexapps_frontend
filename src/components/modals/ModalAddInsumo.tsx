import { Dialog, Transition } from "@headlessui/react";
import { X } from "lucide-react";
import { Dispatch, Fragment, SetStateAction, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllInsumos, Insumo } from "@/api/InsumosAPI";
import { Controller, useForm } from "react-hook-form";
import { DraftSelectedInsumo } from "views/agricola/planes-semanales/CreateTareaLote";
import Select from "react-select";
import Error from "../utilities-components/Error";

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
        <Transition appear show={open} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={() => setOpen(false)}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black bg-opacity-50" />
                </Transition.Child>

                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                    >
                        <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-lg bg-white shadow-xl">
                            <div className="flex justify-between items-center bg-indigo-600 p-5 text-white">
                                <h3 className="text-lg font-semibold uppercase">Agregar Insumo</h3>
                                <button className="text-white hover:text-gray-300" onClick={() => setOpen(false)}>
                                    <X />
                                </button>
                            </div>

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


                                    <div className="bg-gray-50 px-6 py-4 flex justify-end">
                                        <button
                                            type="button"
                                            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 mr-2 font-bold uppercase"
                                            onClick={() => setOpen(false)}
                                        >
                                            Cancelar
                                        </button>
                                        <button
                                            type="submit"
                                            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 font-bold uppercase"
                                        >
                                            Agregar
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </Dialog.Panel>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition>
    );
}
