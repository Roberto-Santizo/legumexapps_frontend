import Error from "@/components/utilities-components/Error";
import { FieldErrors, UseFormRegister } from "react-hook-form";
import InputComponent from "@/components/form/InputComponent";
import { DraftMaterialRegister } from "./CrearRegistroMaterial";

type Props = {
  errors: FieldErrors<DraftMaterialRegister>;
  register: UseFormRegister<DraftMaterialRegister>;
};

export default function FormRegistroMaterial({ errors, register }: Props) {

  return (
    <>
        <InputComponent<DraftMaterialRegister>
          label="Nombre"
          id="name"
          name="name"
          placeholder="Nombre del material"
          register={register}
          validation={{ required: "El nombre del material es obligatorio" }}
          errors={errors}
          type={"text"}
        >
          {errors.name && <Error>{errors.name?.message?.toString()}</Error>}
        </InputComponent>

        <InputComponent<DraftMaterialRegister>
          label="Descripcion"
          id="description"
          name="description"
          placeholder="Ingrese la descripcion"
          register={register}
          validation={{ required: "La description es obligatoria" }}
          errors={errors}
          type={"text"}
        >
          {errors.description && (
            <Error>{errors.description?.message?.toString()}</Error>
          )}
        </InputComponent>

        <InputComponent<DraftMaterialRegister>
          label="Código"
          id="code"
          name="code"
          placeholder="Ingrese el codigo del material"
          register={register}
          validation={{ required: "El código es obligatoria" }}
          errors={errors}
          type={"text"}
        >
          {errors.code && <Error>{errors.code?.message?.toString()}</Error>}
        </InputComponent>

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
      
    </>
  );
}
