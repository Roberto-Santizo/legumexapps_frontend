import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react/jsx-runtime";
import { Dispatch, SetStateAction } from "react";
import { createTaskProductionEmployee, EmployeeProduction } from "@/api/WeeklyProductionPlanAPI";
import { Position } from "@/api/LineasAPI";
import { Controller, useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import Select from "react-select";
import Error from "@/components/utilities-components/Error";
import Spinner from "@/components/utilities-components/Spinner";


type Props = {
    isOpen: boolean;
    setIsOpen: Dispatch<SetStateAction<boolean>>;
    comodines: EmployeeProduction[];
    fijos: EmployeeProduction[];
    positions: Position[];
}

export type DraftTaskProductionEmployee = {
    name: string;
    code: string;
    position_id: string;
    old_position: string;
}

export default function ModalAddEmployee({ isOpen, setIsOpen, comodines, fijos, positions }: Props) {

    const params = useParams();
    const task_p_id = params.task_p_id!!;

    const queryClient = useQueryClient();
    const employeeOptions = comodines.map((employee) => ({
        value: employee.id,
        label: `${employee.name} - ${employee.code} - ${employee.position}`,
    }));

    const positionOptions = positions.map((position) => ({
        value: position.id,
        label: `${position.name}`,
    }));


    const { mutate, isPending } = useMutation({
        mutationFn: createTaskProductionEmployee,
        onError: (error) => {
            toast.error(error.message);
        },
        onSuccess: (data) => {
            toast.success(data);
            setIsOpen(false);
            queryClient.invalidateQueries({ queryKey: ['getTaskProductionDetails', task_p_id] });
        }
    });
    const {
        handleSubmit,
        setValue,
        control,
        formState: { errors }
    } = useForm<DraftTaskProductionEmployee>();

    const onSubmit = (FormData: DraftTaskProductionEmployee) => {
        const exists = fijos.filter(fijo => fijo.code === FormData.code);
        if(exists.length > 0){
            toast.error(`Esta persona ya fue asignada a la posicion ${exists[0].position}`);
        }else{
            mutate({ id: task_p_id, FormData });
        }
    }

    const handleSelectEmployee = (id: string) => {
        const employee = comodines.filter(employee => employee.id === id)[0];
        setValue('name', employee.name);
        setValue('code', employee.code);
        setValue('old_position', employee.position);
    }
    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={() => setIsOpen(false)}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black bg-opacity-70" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="relative transform overflow-hidden bg-white shadow-xl sm:w-full sm:max-w-3xl">
                                <div className="flex justify-between items-center bg-indigo-600 px-6 py-4 text-white">
                                    <h3 className="text-xl font-bold uppercase">
                                        Agregar Empleado
                                    </h3>
                                    <button
                                        className="text-white hover:text-gray-300"
                                        onClick={() => { setIsOpen(false) }}
                                    >
                                        ✕
                                    </button>
                                </div>

                                <div className="p-10 h-72 mb-5">
                                    <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
                                        <div className="flex flex-col gap-2">
                                            <label className="text-lg font-bold uppercase">
                                                Empleados Disponibles:
                                            </label>
                                            <Select
                                                options={employeeOptions}
                                                placeholder={"--SELECCIONE UNA OPCION--"}
                                                onChange={(selected) => {
                                                    if (selected?.value) {
                                                        handleSelectEmployee(selected.value);
                                                    }
                                                }}
                                            />
                                        </div>

                                        <div className="flex flex-col gap-2">
                                            <label className="text-lg font-bold uppercase" htmlFor="position_id">
                                                Posiciones Disponibles:
                                            </label>
                                            <Controller
                                                name="position_id"
                                                control={control}
                                                rules={{ required: "Seleccion una posicion" }}
                                                render={({ field }) => (
                                                    <Select
                                                        {...field}
                                                        options={positionOptions}
                                                        id="position_id"
                                                        placeholder={"--SELECCIONE UNA OPCION--"}
                                                        onChange={(selected) => {
                                                            if (selected?.value) {
                                                                field.onChange(selected.value);
                                                            }
                                                        }}
                                                        value={positionOptions.find(
                                                            (option) => option.value === field.value
                                                        )}
                                                    />
                                                )}
                                            />
                                            {errors.position_id && (
                                                <Error>{errors.position_id?.message?.toString()}</Error>
                                            )}
                                        </div>

                                        <button className="button w-full bg-indigo-500 hover:bg-indigo-600">
                                            {isPending ? <Spinner /> : <p>Crear Asignación</p>}
                                        </button>
                                    </form>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition >
    )
}
