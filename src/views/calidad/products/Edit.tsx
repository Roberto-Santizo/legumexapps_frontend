import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Controller, useForm } from "react-hook-form";
import { Edit as EditIcon, PlusIcon } from "lucide-react";
import { getProductById, Product, ProductDetail } from "@/api/ProductsAPI";
import { editProduct } from "@/api/ProductsAPI";
import { useQueries } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { DraftProduct } from "./Create";
import { getVariedades, Variety } from "@/api/VarietiesAPI";
import Select from "react-select";
import Error from "@/components/utilities-components/Error";
import CreateDefectoModal, { DraftDefecto } from "@/components/modals/ModalCrearDefecto";
import EditDefectoModal from "@/components/modals/ModalEditarDefecto";
import Spinner from "@/components/utilities-components/Spinner";

export default function Edit() {
  const params = useParams();
  const product_id = params.product_id!!;
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
      { queryKey: ['getAllVarieties'], queryFn: () => getVariedades({ page: 1, paginated: '' }) },
      { queryKey: ['getProductById'], queryFn: () => getProductById(product_id) },
    ]
  })

  const isLoading = results.some(result => result.isFetching);

  useEffect(() => {
    if (results[0].data) setVarieties(results[0].data.data);
  }, [results[0].data]);

  useEffect(() => {
    if (results[1].data) {
      setProduct(results[1].data)
      setDefects(results[1].data.defects.map((defect: DraftDefecto) => ({ ...defect, id: Number(defect.id) })));
    };
  }, [results[1].data]);

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

  if (isLoading) return <Spinner />

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
                  <th className="thead-th">Defecto</th>
                  <th className="thead-th">Porcentaje de Tolerancia</th>
                  <th className="thead-th">Acción</th>
                  <th className="thead-th">Estado</th>
                </tr>
              </thead>

              <tbody className="text-sm">
                {defects.map((defect) => (
                  <tr key={defect.name} className="tbody-tr">
                    <td className="tbody-td">{defect.name}</td>
                    <td className="tbody-td">{defect.tolerance_percentage}</td>
                    <td className="tbody-td flex gap-5">
                      <EditIcon className="cursor-pointer hover:text-gray-500" onClick={() => handleEditDefect(defect.id)} />
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

        <button disabled={isPending} className="button bg-indigo-500 hover:bg-indigo-600 w-full">
          {isPending ? <Spinner /> : <p>Guardar Cambios</p>}
        </button>
      </form>

      <CreateDefectoModal modal={modal} setModal={setModal} setDefects={setDefects} defects={defects} />
      <EditDefectoModal modal={editModal} setModal={setEditModal} setDefects={setDefects} defects={defects} id={editingId} />
    </>
  )
}
