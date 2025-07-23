import { Dispatch, SetStateAction } from "react";
import { Position } from "@/api/LineasAPI";
import { useForm } from "react-hook-form";
import { DraftTaskProductionEmployee, TaskProductionEmployee } from "types/taskProductionPlanTypes";
import Select from "react-select";
import Error from "@/components/utilities-components/Error";
import Modal from "../Modal";
import InputSelectSearchComponent from "../form/InputSelectSearchComponent";

type Props = {
    isOpen: boolean;
    setIsOpen: Dispatch<SetStateAction<boolean>>;
    comodines: TaskProductionEmployee[];
    positions: Position[];
    setPositions: Dispatch<SetStateAction<Position[]>>;
    setNewEmployees: Dispatch<SetStateAction<DraftTaskProductionEmployee[]>>;
    setComodines: Dispatch<SetStateAction<TaskProductionEmployee[]>>;
}

export default function ModalAddEmployee({ isOpen, setIsOpen, comodines, positions, setNewEmployees, setComodines, setPositions }: Props) {

    const employeeOptions = comodines.map((employee) => ({
        value: employee.id,
        label: `${employee.name} - ${employee.code} - ${employee.position}`,
    }));

    const positionOptions = positions.map((position) => ({
        value: position.id,
        label: `${position.name}`,
    }));

    const {
        handleSubmit,
        setValue,
        control,
        reset,
        formState: { errors }
    } = useForm<DraftTaskProductionEmployee>();

    const onSubmit = (FormData: DraftTaskProductionEmployee) => {
        const position = positions.find(position => position.id === FormData.position_id);

        if(position){
            setPositions(prev => prev.filter(position => position.id !== FormData.position_id));
        }else{
            FormData.position_id = '';
        }

        FormData.new_position = position?.name ?? '';

        setComodines(prev => prev.filter(employee => employee.code !== FormData.code));
        setNewEmployees(prev => [...prev, FormData]);
        setIsOpen(false);
        reset();

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
                        rules={{}}
                        errors={errors}
                    >
                        {errors.position_id && <Error>{errors.position_id?.message?.toString()}</Error>}
                    </InputSelectSearchComponent>

                    <button className="button w-full bg-indigo-500 hover:bg-indigo-600">
                        <p>Agregar Empleado</p>
                    </button>
                </form>
            </div>
        </Modal>

    )
}
