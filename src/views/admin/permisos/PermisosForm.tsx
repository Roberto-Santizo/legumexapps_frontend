import { FieldErrors, UseFormRegister } from "react-hook-form";
import Error from "@/components/utilities-components/Error";
import { DraftPermiso } from "./CreatePermiso";

type Props = {
    errors: FieldErrors<DraftPermiso>;
    register: UseFormRegister<DraftPermiso>;
}

export default function PermisosForm({ errors, register }: Props) {
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
                    placeholder={"Nombre del permiso"}
                    className="border border-black p-3"
                    {...register("name", { required: "El nombre es obligatorio" })}
                />
                {errors.name && <Error>{errors.name?.message?.toString()}</Error>}
            </div>
        </>
    )
}
