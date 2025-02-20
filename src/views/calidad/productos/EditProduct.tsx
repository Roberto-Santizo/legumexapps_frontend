import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Controller, useForm } from "react-hook-form";
import Select from "react-select";
import { DeleteIcon, Edit, PlusIcon } from "lucide-react";

import { DraftDefecto, DraftProduct, ProductDetail, Variety } from "@/types";
import { useAppStore } from "@/stores/useAppStore";
import { Button } from "@mui/material";
import Spinner from "@/components/Spinner";
import Error from "@/components/Error";
import CreateDefectoModal from "@/components/defectos/CreateDefectoModal";
import EditDefectoModal from "@/components/defectos/EditDefectoModal";

export default function EditProduct() {
  const { product_id } = useParams();
  const [loading, setLoading] = useState<boolean>(true);
  const [product, setProduct] = useState<ProductDetail>({} as ProductDetail);
  const [varieties, setVarieties] = useState<Variety[]>([]);
  const [defects, setDefects] = useState<DraftDefecto[]>([]);
  const [modal, setModal] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<number>(0);
  const [editModal, setEditModal] = useState<boolean>(false);
  const getProductById = useAppStore((state) => state.getProductById);
  const getAllVarieties = useAppStore((state) => state.getAllVarieties);
  const getDefectsByQualityProduct = useAppStore((state) => state.getDefectsByQualityProduct);
  const editProduct = useAppStore((state) => state.editProduct);
  const navigate = useNavigate();

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

  const handleGetVarieties = async () => {
    try {
      const data = await getAllVarieties();
      setVarieties(data);
    } catch (error) {
      toast.error('Hubo un error al traer la información');
    } finally {
      setLoading(false);
    }
  }


  const handleGetInfo = async () => {
    if (product_id) {
      try {
        const data = await getProductById(product_id);
        const data2 = await getDefectsByQualityProduct(product_id);
        setDefects(data2.map(defect => ({ ...defect, id: Number(defect.id) })));
        setProduct(data);
      } catch (error) {
        toast.error('Hubo un error al traer la información');
      } finally {
        setLoading(false);
      }
    }
  }

  useEffect(() => {
    if (product) {
      setValue("name", product.name || "");
      setValue("accepted_percentage", (product.accepted_percentage || 0).toString());
      setValue("variety_product_id", (product.variety_product_id || 0).toString());
    }
  }, [product, setValue]);

  useEffect(() => {
    handleGetInfo();
    handleGetVarieties();
  }, []);

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
    setLoading(true);
    try {
        if(product_id){
          await editProduct(product_id, data, defects);
          toast.success('Producto actualizado correctamente');
          navigate('/productos');
        }
    } catch (error) {
      toast.error('Hubo un error al actualizar el producto, intentelo de nuevo más tarde');
    }finally{
      setLoading(false);
    }
  }

  return (
    <>
      <h2 className="font-bold text-3xl">Editar Producto</h2>

      {(loading && !product) ? <Spinner /> : (
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
            disabled={loading}
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ marginTop: 2 }}
          >
            {loading ? (
              <Spinner />
            ) : (
              <p className="font-bold text-lg">Actualizar Producto</p>
            )}
          </Button>
        </form>
      )}

      <CreateDefectoModal modal={modal} setModal={setModal} setDefects={setDefects} defects={defects} />
      <EditDefectoModal modal={editModal} setModal={setEditModal} setDefects={setDefects} defects={defects} id={editingId} />
    </>
  )
}
