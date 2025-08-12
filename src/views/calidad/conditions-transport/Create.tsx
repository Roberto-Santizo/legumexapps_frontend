import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { createTransporteCondicion, DraftTransporteCondicion } from "@/api/BoletaTransporteAPI";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Spinner from "@/components/utilities-components/Spinner";
import Error from "@/components/utilities-components/Error";
import InputComponent from "@/components/form/InputComponent";

export default function Create() {
  const navigate = useNavigate();

  const { mutate,isPending } = useMutation({
    mutationFn: createTransporteCondicion,
    onError: () => {
      toast.error('Hubo un error al crear la condición');
    },
    onSuccess: () => {
      toast.success('Condición creada correctamente');
      navigate('/transporte-boleta/condiciones');
    }
  });
  const { 
    handleSubmit,
    register,
    formState:{errors}  
  } = useForm<DraftTransporteCondicion>();

  const onSubmit = (data : DraftTransporteCondicion) => mutate(data);
  return (
    <>
      <h1 className="font-bold text-4xl">Crear Condición</h1>

      <form className="w-3/4 shadow-xl p-10 mx-auto mt-10" noValidate onSubmit={handleSubmit(onSubmit)}>

        <InputComponent<DraftTransporteCondicion>
            label="Codición"
            id="name"
            name="name"
            placeholder="Nombre de la condición"
            register={register}
            validation={{required: 'El nombre codición es requerida'}}
            errors={errors}
            type={'text'}
        >
            {errors.name && <Error>{errors.name?.message?.toString()}</Error>}
        </InputComponent>
       
        <button disabled={isPending} className="button bg-indigo-500 hover:bg-indigo-600 w-full mt-5">
          {isPending ? <Spinner /> : <p>Crear Codición</p>}
        </button>
      </form>
    </>
  )
}
