import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { DeleteIcon, Edit, PlusIcon } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { createProduct } from "@/api/ProductsAPI";
import { getVariedades, Variety } from "@/api/VarietiesAPI";
import { useQuery } from "@tanstack/react-query";
import Spinner from "@/components/utilities-components/Spinner";
import Error from "@/components/utilities-components/Error";
import ShowErrorAPI from "@/components/utilities-components/ShowErrorAPI";
import ModalCrearDefecto, { DraftDefecto } from "@/components/modals/ModalCrearDefecto";
import ModalEditarDefecto from "@/components/modals/ModalEditarDefecto";
import InputComponent from "@/components/form/InputComponent";
import InputSelectSearchComponent from "@/components/form/InputSelectSearchComponent";

export type DraftProduct = {
  name: string,
  variety_product_id: string,
  accepted_percentage: string
}
export default function Create() {
  const [varieties, setVarieties] = useState<Variety[]>([]);
  const [modal, setModal] = useState<boolean>(false);
  const [editModal, setEditModal] = useState<boolean>(false);
  const [defects, setDefects] = useState<DraftDefecto[]>([]);
  const [editingId, setEditingId] = useState<number>(0);
  const navigate = useNavigate();

  const { mutate, isPending } = useMutation({
    mutationFn: createProduct,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      toast.success(data);
      navigate('/productos');
    }
  });
  const { data, isError, isLoading } = useQuery({
    queryKey: ['getAllVarieties'],
    queryFn: () => getVariedades({ page: 1, paginated: '' }),
  });

  useEffect(() => {
    if (data) {
      setVarieties(data.data);
    }
  }, [data]);

  const varietiesOptions = varieties.map((variety) => ({
    value: variety.id,
    label: variety.name,
  }));

  const {
    handleSubmit,
    register,
    control,
    formState: { errors }
  } = useForm<DraftProduct>();


  const handleEditDefect = (id: number) => {
    setEditingId(id);
    setEditModal(!editModal);
  }

  const deleteDefect = (id: DraftDefecto['id']) => {
    setDefects((prev) => prev.filter((defect) => defect.id !== id));
  }

  const onSubmit = async (data: DraftProduct) => {
    if (defects.length === 0) {
      toast.error('Debe relacionar al menos un defecto al producto');
      return;
    }
    mutate({ FormData: data, defects });
  }

  if (isError) return <ShowErrorAPI />
  if (isLoading) return <Spinner />
  return (
    <>
      <h2 className="md:text-4xl text-xl text-center md:text-left font-bold">Crear Producto</h2>

      <form className="mt-10 md:w-2/3 mx-auto shadow p-10 space-y-5" noValidate onSubmit={handleSubmit(onSubmit)}>

        <InputComponent<DraftProduct>
          label="Nombre"
          id="name"
          name="name"
          placeholder="Nombre del Producto"
          register={register}
          validation={{ required: 'El nombre del producto es obligatorio' }}
          errors={errors}
          type={'text'}
        >
          {errors.name && <Error>{errors.name?.message?.toString()}</Error>}
        </InputComponent>

        <InputSelectSearchComponent<DraftProduct>
          label="Variedad"
          id="variety_product_id"
          name="variety_product_id"
          options={varietiesOptions}
          control={control}
          rules={{ required: 'La variedad es obligatoria' }}
          errors={errors}
        >
          {errors.variety_product_id && <Error>{errors.variety_product_id?.message?.toString()}</Error>}
        </InputSelectSearchComponent>

        <InputComponent<DraftProduct>
          label="Porcentaje de Calidad Aceptado"
          id="accepted_percentage"
          name="accepted_percentage"
          placeholder="Porcentaje de Calidad Aceptado de Producto"
          register={register}
          validation={{ required: 'El porcentaje de calidad aceptado es obligatorio' }}
          errors={errors}
          type={'number'}
        >
          {errors.accepted_percentage && <Error>{errors.accepted_percentage?.message?.toString()}</Error>}
        </InputComponent>

        <fieldset>
          <button type="button" className="button bg-indigo-500 flex gap-2 hover:bg-indigo-600 items-center" onClick={() => setModal(!modal)}>
            <PlusIcon />
            <p className="text-xs md:text-base">Relacionar Defecto</p>
          </button>

          {defects.length === 0 ? <p className="text-center py-5">No tiene defectos relacionados</p> : (
            <table className="table mt-5">
              <thead>
                <tr className="thead-tr">
                  <th className="thead-th">Defecto</th>
                  <th className="thead-th">Porcentaje de Tolerancia</th>
                  <th className="thead-th">Acción</th>
                </tr>
              </thead>

              <tbody>
                {defects.map((defect) => (
                  <tr key={defect.name} className="tbody-tr">
                    <td className="tbody-td">{defect.name}</td>
                    <td className="tbody-td">{defect.tolerance_percentage}</td>
                    <td className="tbody-td flex gap-5">
                      <Edit className="cursor-pointer hover:text-gray-500" onClick={() => handleEditDefect(defect.id)} />
                      <DeleteIcon className="cursor-pointer hover:text-gray-500" onClick={() => deleteDefect(defect.id)} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </fieldset>

        <button disabled={isPending} className="button bg-indigo-500 hover:bg-indigo-600 w-full text-xs md:text-base">
          {isPending ? <Spinner /> : <p>Crear Producto</p>}
        </button>
      </form>

      <ModalCrearDefecto modal={modal} setModal={setModal} setDefects={setDefects} defects={defects} />
      <ModalEditarDefecto modal={editModal} setModal={setEditModal} setDefects={setDefects} defects={defects} id={editingId} />
    </>
  )
}
