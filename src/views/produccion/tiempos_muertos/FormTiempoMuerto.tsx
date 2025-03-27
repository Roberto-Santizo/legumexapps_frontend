import Error from "@/components/Error"
import { FieldValues, UseFormRegister, FieldErrors } from "react-hook-form"
import { DraftTiempoMuerto } from "./CrearTiempoMuerto";

type Props = {
    register: UseFormRegister<DraftTiempoMuerto>;
    errors: FieldErrors<FieldValues>
}

export default function FormTiempoMuerto({ register, errors }: Props) {
    return (
        <>
            <div className="flex flex-col gap-2">
                <label className="text-lg font-bold uppercase" htmlFor="name">
                    Descripción:
                </label>
                <input
                    autoComplete="off"
                    id="name"
                    type="text"
                    placeholder="Descripción del tiempo muerto"
                    className="border border-black p-3"
                    {...register("name", { required: "La descripción del tiempo muerto es requerida" })}
                />
                {errors.name?.message && <Error>{String(errors.name.message)}</Error>}
            </div>

            <div className="flex flex-col gap-2">
                <label className="text-lg font-bold uppercase" htmlFor="hours">
                    Horas:
                </label>
                <input
                    autoComplete="off"
                    id="hours"
                    type="number"
                    placeholder="Horas totales del tiempo muerto"
                    className="border border-black p-3"
                    {...register("hours", { required: "La cantidad de horas es necesaria" })}
                />
                {errors.hours?.message && <Error>{String(errors.hours.message)}</Error>}
            </div>
        </>
    )
}
