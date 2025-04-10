import { Dispatch, SetStateAction } from "react";
import { createTaskProductionEmployee, EmployeeProduction } from "@/api/WeeklyProductionPlanAPI";
import { Position } from "@/api/LineasAPI";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import Select from "react-select";
import Error from "@/components/utilities-components/Error";
import Spinner from "@/components/utilities-components/Spinner";
import Modal from "../Modal";
import InputSelectSearchComponent from "../form/InputSelectSearchComponent";

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
        if (!FormData.old_position) {
            toast.error('Seleccione el empleado a asignar');
            return;
        }
        if (exists.length > 0) {
            toast.error(`Esta persona ya fue asignada a la posicion ${exists[0].position}`);
        } else {
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
        <Modal modal={isOpen} closeModal={() => setIsOpen(false)} title="Asignación de empleado">
            <div className="p-10 h-72 mb-10">
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

                    <InputSelectSearchComponent<DraftTaskProductionEmployee>
                        label="Posiciones Disponibles"
                        id="position_id"
                        name="position_id"
                        options={positionOptions}
                        control={control}
                        rules={{ required: 'Seleccione una posición' }}
                        errors={errors}
                    >
                        {errors.position_id && <Error>{errors.position_id?.message?.toString()}</Error>}
                    </InputSelectSearchComponent>

                    <button className="button w-full bg-indigo-500 hover:bg-indigo-600">
                        {isPending ? <Spinner /> : <p>Crear Asignación</p>}
                    </button>
                </form>
            </div>
        </Modal>

    )
}
