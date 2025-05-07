
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useMutation } from "@tanstack/react-query";
import Spinner from "@/components/utilities-components/Spinner";
import { RegistroMaterial } from "@/api/BodegaRegistroMaterialAPI";
import FormRegistroMaterial from "./FormRegistroMaterial";

export type DraftMaterialRegister = {
    name: string;
    description: string;
    code: string;
    blocked: boolean;
  };

export default function CrearRegistroMaterial() {
  const navigate = useNavigate();

  const { mutate, isPending } = useMutation({
    mutationFn: RegistroMaterial,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      toast.success(data);
      navigate('/material-empaque/registro');
    }
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DraftMaterialRegister>();

  const onSubmit = (data: DraftMaterialRegister) => { mutate(data) };

    return(
      <>
        <h2 className="text-4xl font-bold">Material de empaque</h2>
        <form
          className="mt-10 w-3/4 mx-auto shadow-xl p-10 space-y-5"
          onSubmit={handleSubmit(onSubmit)}
        >
  
          <FormRegistroMaterial register={register} errors={errors} />
  
          <button className="button bg-indigo-500 hover:bg-indigo-600 w-full">
            {isPending ? <Spinner /> : <p>Registrar material</p>}
          </button>
        </form>
      </>
    );
}

