
import {createReceptionMaterial} from "@/api/BodegaMaterialAPI";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useMutation } from "@tanstack/react-query";
import Spinner from "@/components/utilities-components/Spinner";
import FormRecepcionMaterial from "./FormRecepcionMaterial";

export type DraftMaterialReception = {
    lote: string;
    quantity: string;
    receipt_date: string;
    invoice_date: string;
};

export default function CrearRerecpcionMaterial() {
  const navigate = useNavigate();

  const { mutate, isPending } = useMutation({
    mutationFn: createReceptionMaterial,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      toast.success(data);
      navigate('/proveedor');
    }
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DraftMaterialReception>();

  const onSubmit = (data: DraftMaterialReception) => { mutate(data) }; 

    return(
      <>
        <h2 className="text-4xl font-bold">Registrar recepcion de material</h2>
        <form
          className="mt-10 w-3/4 mx-auto shadow-xl p-10 space-y-5"
          onSubmit={handleSubmit(onSubmit)}
        >
  
          <FormRecepcionMaterial register={register} errors={errors} />
  
          <button className="button bg-indigo-500 hover:bg-indigo-600 w-full">
            {isPending ? <Spinner /> : <p>Registrar recepcion de material de empaque</p>}
          </button>
        </form>
      </>
    );
}

