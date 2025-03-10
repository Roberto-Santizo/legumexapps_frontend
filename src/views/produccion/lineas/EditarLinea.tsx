import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

export default function EditarLinea() {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();

  const onSubmit = (data: any) => {
    console.log("Datos actualizados:", data);
    navigate("/lineas");
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-5">Editar Línea</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Código</label>
          <input
            type="text"
            {...register("codigo", { required: true })}
            className="w-full border rounded-lg p-2"
            defaultValue="1" 
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Total de personas</label>
          <input
            type="number"
            {...register("totalPersonas", { required: true })}
            className="w-full border rounded-lg p-2"
            defaultValue="1" 
          />
        </div>

        <div className="flex justify-end gap-4">
          <button
            type="button"
            className="bg-gray-500 text-white px-4 py-2 rounded-lg"
            onClick={() => navigate("/lineas")}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          >
            Guardar Cambios
          </button>
        </div>
      </form>
    </div>
  );
}
