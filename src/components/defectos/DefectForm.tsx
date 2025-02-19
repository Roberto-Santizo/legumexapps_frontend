import { DraftDefecto } from "@/types";
import { FieldErrors, UseFormRegister } from "react-hook-form";
import Error from "@/components/Error";

type Props = {
    register: UseFormRegister<DraftDefecto>;
    errors: FieldErrors<DraftDefecto>;
}

export default function DefectForm({register,errors} : Props) {
    return (
        <>
            <div className="flex flex-col gap-2">
                <label className="text-lg font-bold uppercase" htmlFor="name">
                    Nombre:
                </label>
                <input
                    autoComplete="off"
                    id="name"
                    type="text"
                    placeholder="Nombre del Defecto"
                    className="border border-black p-3"
                    {...register('name', {
                        required: 'El nombre de la variedad es obligatorio'
                    })}
                />
                {errors.name && <Error>{errors.name?.message?.toString()}</Error>}
            </div>

            <div className="flex flex-col gap-2">
                <label className="text-lg font-bold uppercase" htmlFor="tolerance_percentage">
                    Porcentaje de Tolerancia:
                </label>
                <input
                    autoComplete="off"
                    id="tolerance_percentage"
                    type="number"
                    placeholder="Porcentaje de Tolerancia"
                    className="border border-black p-3"
                    {...register('tolerance_percentage', {
                        required: 'El porcentaje de tolerancia es obligatoria',
                    })}
                />
                {errors.tolerance_percentage && <Error>{errors.tolerance_percentage?.message?.toString()}</Error>}
            </div>
        </>
    )
}
