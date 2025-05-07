
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useMutation } from "@tanstack/react-query";
import Spinner from "@/components/utilities-components/Spinner";
import FormInsumos from "./FormInsumos";
import {createReceptionInsumos} from "@/api/BodegaInsumosAPI";

export type DraftInputs = {
    units: number;
    unit_value: number;
    total_value: number;
    invoice: string;
    invoice_date: string;
    receipt_date: string;
};

export default function CrearInsumo() {
  const navigate = useNavigate();

  const { mutate, isPending } = useMutation({
    mutationFn: createReceptionInsumos, //agregar aca el nombre de la api de insumo
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
  } = useForm<DraftInputs>();

  const onSubmit = (data: DraftInputs) => { mutate(data) }; //esto se corrigue a la hora de coloar el codigo de la api

    return(
      <>
        <h2 className="text-4xl font-bold">Registrar insumos</h2>
        <form
          className="mt-10 w-3/4 mx-auto shadow-xl p-10 space-y-5"
          onSubmit={handleSubmit(onSubmit)}
        >
          <FormInsumos register={register} errors={errors} />
  
          <button className="button bg-indigo-500 hover:bg-indigo-600 w-full">
            {isPending ? <Spinner /> : <p>Registrar nuevo insumo</p>}
          </button>
        </form>
      </>
    );
}

