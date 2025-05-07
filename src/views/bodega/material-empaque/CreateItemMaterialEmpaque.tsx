import { FieldErrors, UseFormRegister } from "react-hook-form";
import { DraftMaterialRegister } from "../formularios/CrearRegistroMaterial";

type Props = {
  errors: FieldErrors<DraftMaterialRegister>;
  register: UseFormRegister<DraftMaterialRegister>;
};

export default function FormRegistroMaterial({ errors, register }: Props) {
  return (
    <div>
        <div className="flex flex-col gap-2">
          {" "}
          <label htmlFor="blocked" className="font-semibold">
            Bloqueado
          </label>
          <select
            id="blocked"
            {...register("blocked", { required: "El bloqueo es obligatorio" })}
            className="border p-2 rounded-md"
          >
            <option value="">Seleccione una opción</option>
            <option value="true">Sí</option>
            <option value="false">No</option>
          </select>
          {errors.blocked && (
            <span className="text-red-500 text-sm">
              {errors.blocked.message?.toString()}
            </span>
          )}
        </div>
      
    </div>
  );
}
