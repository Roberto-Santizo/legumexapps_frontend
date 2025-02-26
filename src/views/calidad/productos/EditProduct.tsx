import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Controller, useForm } from "react-hook-form";
import Select from "react-select";
import { DeleteIcon, Edit, PlusIcon } from "lucide-react";
import { getProductById } from "@/api/ProductsAPI";
import { Defect, DraftDefecto, DraftProduct, Product, ProductDetail, Variety } from "@/types";
import { Button } from "@mui/material";
import Error from "@/components/Error";
import CreateDefectoModal from "@/components/defectos/CreateDefectoModal";
import EditDefectoModal from "@/components/defectos/EditDefectoModal";
import { editProduct } from "@/api/ProductsAPI";
import { getAllVarieties } from "@/api/VarietiesAPI";
import { useQueries } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { getDefectsByQualityProduct } from "@/api/DefectosAPI";
import Spinner from "@/components/Spinner";

export default function EditProduct() {
  const { product_id } = useParams();
  const [product, setProduct] = useState<ProductDetail>({} as ProductDetail);
  const [varieties, setVarieties] = useState<Variety[]>([]);
  const [defects, setDefects] = useState<DraftDefecto[]>([]);
  const [modal, setModal] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<number>(0);
  const [editModal, setEditModal] = useState<boolean>(false);
  const navigate = useNavigate();

  const { mutate, isPending } = useMutation({
    mutationFn: ({ product_id, data, defects }: { product_id: Product['id'], data: DraftProduct, defects: DraftDefecto[] }) => editProduct(product_id, data, defects),
    onError: () => {
      toast.error('Hubo un error al actualizar el producto, intentelo de nuevo más tarde');
    },
    onSuccess: () => {
      toast.success('Producto actualizado correctamente');
      navigate('/productos');
    }
  });
  const results = useQueries({
    queries: [
      { queryKey: ['getAllVarieties'], queryFn: getAllVarieties },
      { queryKey: ['getProductById'], queryFn: () => product_id ? getProductById(product_id) : Promise.reject('Product ID es indefinido') },
      { queryKey: ['getDefectsByQualityProduct'], queryFn: () => product_id ? getDefectsByQualityProduct(product_id) : Promise.reject('Product ID es indefinido') }
    ]
  })

  useEffect(() => {
    if (results[0].data) setVarieties(results[0].data);
  }, [results[0].data]);

  useEffect(() => {
    if (results[1].data) setProduct(results[1].data);
  }, [results[1].data]);

  useEffect(() => {
    if (results[2].data) {
      setDefects(results[2].data.map((defect: Defect) => ({ ...defect, id: Number(defect.id) })));
    }
  }, [results[2].data]);


  const varietiesOptions = varieties.map((variety) => ({
    value: variety.id,
    label: variety.name,
  }));


  const {
    handleSubmit,
    register,
    control,
    formState: { errors },
    setValue
  } = useForm<DraftProduct>();



  useEffect(() => {
    if (product) {
      setValue("name", product.name || "");
      setValue("accepted_percentage", (product.accepted_percentage || 0).toString());
      setValue("variety_product_id", (product.variety_product_id || 0).toString());
    }
  }, [product, setValue]);

  const deleteDefect = (id: DraftDefecto['id']) => {
    setDefects((prev) => prev.filter((defect) => defect.id !== id));
  }

  const handleEditDefect = (id: number) => {
    setEditingId(id);
    setEditModal(!editModal);
  }

  const handleChangeStatus = (defecto: DraftDefecto) => {
    setDefects((prev) => prev.map((defect) => defect.id === defecto.id ? { ...defect, status: !defect.status } : defect));
  }

  const onSubmit = async (data: DraftProduct) => {
    if (product_id) {
      mutate({ product_id, data, defects });
    }
  }

  return (
    <>
      <h2 className="font-bold text-3xl">Editar Producto</h2>

      <form className="w-1/2 mx-auto mt-10 space-y-5" onSubmit={handleSubmit(onSubmit)}>
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
            {...register('name', { required: 'El nombre del producto es requerido' })}
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
                value={varietiesOptions.find(option => option.value === product.variety_product_id)}
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
                  <th className="thead-th">ID</th>
                  <th className="thead-th">Defecto</th>
                  <th className="thead-th">Porcentaje de Tolerancia</th>
                  <th className="thead-th">Acción</th>
                  <th className="thead-th">Estado</th>
                </tr>
              </thead>

              <tbody className="text-sm">
                {defects.map((defect) => (
                  <tr key={defect.name} className="tbody-tr">
                    <td className="tbody-td">{defect.id}</td>
                    <td className="tbody-td">{defect.name}</td>
                    <td className="tbody-td">{defect.tolerance_percentage}</td>
                    <td className="tbody-td flex gap-5">
                      <Edit className="cursor-pointer hover:text-gray-500" onClick={() => handleEditDefect(defect.id)} />
                      <DeleteIcon className="cursor-pointer hover:text-gray-500" onClick={() => deleteDefect(defect.id)} />
                    </td>
                    <td className="tbody-td button">
                      <button type="button" onClick={() => handleChangeStatus(defect)}>
                        {defect.status ? <p className="p-2 bg-green-500 hover:bg-green-600">Activo</p> : <p className="p-2 bg-red-500 hover:bg-red-600">Inactivo</p>}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </fieldset>

        <Button
          disabled={isPending}
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ marginTop: 2 }}
        >
          {isPending ? (
              <Spinner />
            ) : ( 
          <p className="font-bold text-lg">Actualizar Producto</p>
          )}
        </Button>
      </form>

      <CreateDefectoModal modal={modal} setModal={setModal} setDefects={setDefects} defects={defects} />
      <EditDefectoModal modal={editModal} setModal={setEditModal} setDefects={setDefects} defects={defects} id={editingId} />
    </>
  )
}
