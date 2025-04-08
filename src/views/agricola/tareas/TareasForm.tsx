import Error from "@/components/utilities-components/Error";
import { DraftTarea } from "./CreateTarea";
import { FieldErrors, UseFormRegister } from "react-hook-form";

type Props = {
    errors: FieldErrors<DraftTarea>;
    register: UseFormRegister<DraftTarea>;
}

export default function TareasForm({ errors, register }: Props) {
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
                    placeholder={"Nombre de la tarea"}
                    className="border border-black p-3"
                    {...register("name", { required: "El nombre es obligatorio" })}
                />
                {errors.name && <Error>{errors.name?.message?.toString()}</Error>}
            </div>

            <div className="flex flex-col gap-2">
                <label className="text-lg font-bold uppercase" htmlFor="code">
                    Codigo:
                </label>
                <input
                    autoComplete="off"
                    id="code"
                    type="text"
                    placeholder={"Codigo de la tarea"}
                    className="border border-black p-3"
                    {...register("code", { required: "El codigo es obligatorio" })}
                />
                {errors.code && <Error>{errors.code?.message?.toString()}</Error>}
            </div>

            <div className="flex flex-col gap-2">
                <label className="text-lg font-bold uppercase" htmlFor="name">
                    Descripción:
                </label>
                <input
                    autoComplete="off"
                    id="name"
                    type="text"
                    placeholder={"Descripción de la tarea"}
                    className="border border-black p-3"
                    {...register("description", {
                        required: "La descripción es obligatorio",
                    })}
                />
                {errors.description && (
                    <Error>{errors.description?.message?.toString()}</Error>
                )}
            </div>
        </>
    )
}
