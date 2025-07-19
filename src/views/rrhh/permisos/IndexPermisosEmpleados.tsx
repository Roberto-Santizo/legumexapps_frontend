import { useEffect, useState } from "react";
import { useQuery, useMutation, keepPreviousData } from "@tanstack/react-query";
import { closeEmployeePermission, getPermisosEmpleadosPaginated, PermisoEmpleado } from "@/api/PermisosEmpleadosAPI";
import { formatDate } from "@/helpers";
import { CheckBadgeIcon } from "@heroicons/react/16/solid";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { Eye } from "lucide-react";
import Spinner from "@/components/utilities-components/Spinner";
import ShowErrorAPI from "@/components/utilities-components/ShowErrorAPI";
import Pagination from "@/components/utilities-components/Pagination";
import Swal from "sweetalert2";

export default function IndexPermisosEmpleados() {
  const [pageCount, setPageCount] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [empleadosPermisos, setEmpleadosPermisos] = useState<PermisoEmpleado[]>([]);

  const { mutate, isPending } = useMutation({
    mutationFn: ({ id, flag }: { id: PermisoEmpleado['id'], flag: string }) => closeEmployeePermission(id, flag),
    onError: () => {
      toast.error("Hubo un error al cerrar el permiso");
    },
    onSuccess: () => {
      toast.success("Permiso cerrado correctamente");
      refetch();
    }
  });

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['getPermisosEmpleadosPaginated', currentPage],
    queryFn: () => getPermisosEmpleadosPaginated(currentPage),
    placeholderData: keepPreviousData
  });

  useEffect(() => {
    if (data) {
      setPageCount(data.meta.last_page);
      setCurrentPage(data.meta.current_page);
      setEmpleadosPermisos(data.data);
    }
  }, [data]);

  const handlePageChange = (selectedItem: { selected: number }) => {
    setCurrentPage(selectedItem.selected + 1);
  };

  const handleClosePermission = (id: PermisoEmpleado['id'], flag: string) => {

    const text = flag === '1' ? "Si confirmas el permiso la asignación semanal no cambiará" : "Si el empleado no tiene permiso la posicion de los empleados se intercambiará";
    Swal.fire({
      title: "¿Deseas cerrar el permiso?",
      text: text,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Confirmar",
      cancelButtonText: "Cancelar"
    }).then((result) => {
      if (result.isConfirmed) {
        mutate({ id, flag });
      }
    });

  }

  if (isLoading) return <Spinner />;
  if (isError) return <ShowErrorAPI />;
  if (isPending) return <Spinner />;
  if (empleadosPermisos) return (
    <div>
      <h2 className="font-bold text-xl text-center xl:text-left xl:text-4xl">Permisos de Empleados Cambios de Linea</h2>

      <div className="table-wrapper">
        <table className="table mt-10">
          <thead>
            <tr className="thead-tr">
              <th className="thead-th">Linea</th>
              <th className="thead-th">Empleado Original</th>
              <th className="thead-th">Empleado Nuevo</th>
              <th className="thead-th">Fecha</th>
              <th className="thead-th">Acción</th>
            </tr>
          </thead>
          <tbody>
            {empleadosPermisos.map(permisoEmpleado => (
              <tr className="tbody-tr" key={permisoEmpleado.id}>
                <td className="tbody-td">{permisoEmpleado.line}</td>
                <td className="tbody-td">{permisoEmpleado.original_name}</td>
                <td className="tbody-td">{permisoEmpleado.new_name}</td>
                <td className="tbody-td">{formatDate(permisoEmpleado.date)}</td>
                <td className="tbody-td flex gap-5">
                  {permisoEmpleado.confirmed ? (
                    <CheckBadgeIcon className="w-6 text-green-500" />
                  ) : (
                    <>
                      <button className="button bg-green-500" onClick={() => handleClosePermission(permisoEmpleado.id, '1')}>CON PERMISO</button>
                      <button className="button bg-red-500" onClick={() => handleClosePermission(permisoEmpleado.id, '0')}>SIN PERMISO</button>
                    </>
                  )}
                  <Link to={`/permisos-empleados/${permisoEmpleado.id}`}>
                    <Eye className="cursor-pointer hover:text-gray-500" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mb-10 flex justify-end">
        <Pagination
          currentPage={currentPage}
          pageCount={pageCount}
          handlePageChange={handlePageChange}
        />
      </div>
    </div>
  )
}
