import Error from "@/components/utilities-components/Error";
import { FieldErrors, UseFormRegister } from "react-hook-form";
import { DraftRole } from "./CreateRole";

type Props = {
    register: UseFormRegister<DraftRole>;
    errors: FieldErrors<DraftRole>;
}

export default function RolesForm({ register, errors }: Props) {
    return (
        <div className="flex flex-col gap-2">
            <label className="text-lg font-bold uppercase" htmlFor="name">
                Nombre:
            </label>
            <input
                autoComplete="off"
                id="name"
                type="text"
                placeholder={"Nombre del rol"}
                className="border border-black p-3"
                {...register("name", { required: "El nombre es obligatorio" })}
            />
            {errors.name && <Error>{errors.name?.message?.toString()}</Error>}
        </div>
    )
}
