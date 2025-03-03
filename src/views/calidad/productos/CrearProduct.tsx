import Select from "react-select";
import { useNavigate } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { DeleteIcon, Edit, PlusIcon } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { DraftDefecto, DraftProduct, Variety } from "@/types";
import { Button } from "@mui/material";
import Spinner from "@/components/Spinner";
import Error from "@/components/Error";
import CreateDefectoModal from "@/components/defectos/CreateDefectoModal";
import EditDefectoModal from "@/components/defectos/EditDefectoModal";
import { createProduct } from "@/api/ProductsAPI";
import { getAllVarieties } from "@/api/VarietiesAPI";
import { useQuery } from "@tanstack/react-query";
import ShowErrorAPI from "@/components/ShowErrorAPI";

export default function CrearVariedad() {
  const [varieties, setVarieties] = useState<Variety[]>([]);
  const [modal, setModal] = useState<boolean>(false);
  const [editModal, setEditModal] = useState<boolean>(false);
  const [defects, setDefects] = useState<DraftDefecto[]>([]);
  const [editingId, setEditingId] = useState<number>(0);
  const navigate = useNavigate();

  const { mutate } = useMutation({
    mutationFn: ({ data, defects }: { data: DraftProduct; defects: DraftDefecto[] }) => createProduct(data, defects),
    onError: () => {
      toast.error('Hubo un error al crear el producto, intentelo de nuevo más tarde');
    },
    onSuccess: () => {
      toast.success('Producto creado correctamente');
      navigate('/productos');
    }
  });
  const { data, isError, isLoading } = useQuery({
    queryKey: ['getAllVarieties'],
    queryFn: getAllVarieties
  });

  useEffect(() => {
    if (data) {
      setVarieties(data);
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
    mutate({ data, defects });
  }

  if (isError) return <ShowErrorAPI />
  if (isLoading) return <Spinner />
  return (
    <>
      <h2 className="text-4xl font-bold">Crear Producto</h2>

      <div>
        <form className="mt-10 w-2/3 mx-auto shadow p-10 space-y-5" noValidate onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-2">
            <label className="text-lg font-bold uppercase" htmlFor="name">
              Nombre:
            </label>
            <input
              autoComplete="off"
              id="name"
              type="text"
              placeholder="Nombre del producto"
              className="border border-black p-3"
              {...register('name', { required: 'El nombre del producto es obligatorio' })}
            />
            {errors.name && (
              <Error>{errors.name?.message?.toString()}</Error>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-lg font-bold uppercase" htmlFor="variety_product_id">
              Variedad:
            </label>
            <Controller
              name="variety_product_id"
              control={control}
              rules={{ required: "La variedad es obligatoria" }}
              render={({ field }) => (
                <Select
                  {...field}
                  options={varietiesOptions}
                  id="variety_product_id"
                  placeholder={"--SELECCIONE UNA OPCION--"}
                  onChange={(selected) => field.onChange(selected?.value)}
                  value={varietiesOptions.find(
                    (option) => option.value === field.value
                  )}
                />
              )}
            />
            {errors.variety_product_id && (
              <Error>{errors.variety_product_id?.message?.toString()}</Error>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-lg font-bold uppercase" htmlFor="accepted_percentage">
              Porcentaje de Calidad Aceptado:
            </label>
            <input
              autoComplete="off"
              id="accepted_percentage"
              type="number"
              placeholder="Porcentaje aceptado de calidad del producto"
              className="border border-black p-3"
              {...register('accepted_percentage', { required: 'El porcentaje de calidad aceptado es obligatorio' })}
            />

            {errors.accepted_percentage && (
              <Error>{errors.accepted_percentage?.message?.toString()}</Error>
            )}
          </div>

          <fieldset>
            <button type="button" className="button bg-blue-500 flex gap-2 hover:bg-blue-600" onClick={() => setModal(!modal)}>
              <PlusIcon />
              <p>Relacionar Defecto</p>
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

          <Button
            disabled={isLoading}
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ marginTop: 2 }}
          >
            {isLoading ? (
              <Spinner />
            ) : (
              <p className="font-bold text-lg">Crear Producto</p>
            )}
          </Button>
        </form>
      </div>

      <CreateDefectoModal modal={modal} setModal={setModal} setDefects={setDefects} defects={defects} />
      <EditDefectoModal modal={editModal} setModal={setEditModal} setDefects={setDefects} defects={defects} id={editingId} />
    </>
  )
}
