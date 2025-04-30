import { useForm } from "react-hook-form";
// import { toast } from "react-toastify";
import InputComponent from "@/components/form/InputComponent";
import Error from "@/components/utilities-components/Error";

export type MaterialReceipt = {
  name: string;
  description: string;
  code: string;
  blocked: boolean;
};

export default function MaterialEmpaque() {
  const {
    handleSubmit,
    register,
    // control,
    formState: { errors },
  } = useForm<MaterialReceipt>();

  const onSubmit = () => {}
  return (
    <div>
      <h1 className="font-bold text-3xl uppercase">
        Ingreso a bodega material de empaque
      </h1>
      <form className="w-3/4 mb-10 shadow-xl p-10 mx-auto mt-10 space-y-10" onSubmit={handleSubmit(onSubmit)}>
        <InputComponent<MaterialReceipt>
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

        <InputComponent<MaterialReceipt>
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

        <InputComponent<MaterialReceipt>
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

        <div className="flex flex-col gap-2"> {/* Mejorar esta parte para que el select trabaje con un componente  */}
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

        <button className="button bg-indigo-500 hover:bg-indigo-600 w-full">
          {/* <Spinner />  */}
          <p>Registrar ingreso a bodega</p>
        </button>
      </form>
    </div>
  );
}
