import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { closeEmployeePermission, getPermisoEmployeeById, PermisoEmpleado } from "@/api/PermisosEmpleadosAPI";
import { toast } from "react-toastify";
import Spinner from "@/components/utilities-components/Spinner";
import ShowErrorAPI from "@/components/utilities-components/ShowErrorAPI";
import Swal from "sweetalert2";

export default function ShowPermisoEmpleado() {
  const params = useParams();
  const id = params.id!!;

  const navigate = useNavigate();

  const { mutate, isPending } = useMutation({
    mutationFn: ({ id, flag }: { id: PermisoEmpleado['id'], flag: string }) => closeEmployeePermission(id, flag),
    onError: () => {
      toast.error("Hubo un error al cerrar el permiso");
    },
    onSuccess: () => {
      toast.success("Permiso cerrado correctamente");
      navigate('/permisos-empleados');
    }
  });

  const { data: permission, isLoading, isError } = useQuery({
    queryKey: ['getPermisoEmployeeById', id],
    queryFn: () => getPermisoEmployeeById(id)
  });

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
  if (permission) return (
    <>
      <h2 className="font-bold text-4xl">Permiso de Empleado Linea {permission.line}</h2>

      <div className="mt-10 grid grid-cols-2 gap-5 text-xl">
        <div className="shadow p-5 space-y-5">
          <h3 className="font-bold text-3xl">Información del empleado original</h3>
          <p><span className="font-bold">Codigo: </span>{permission.original_code}</p>
          <p><span className="font-bold">Nombre: </span>{permission.original_name}</p>
          <p><span className="font-bold">Posición: </span>{permission.original_position}</p>
        </div>
        <div className="shadow p-5 space-y-5">
          <h3 className="font-bold text-3xl">Información del empleado nuevo</h3>
          <p><span className="font-bold">Codigo: </span>{permission.new_code}</p>
          <p><span className="font-bold">Nombre: </span>{permission.new_name}</p>
          <p><span className="font-bold">Posición: </span>{permission.new_position}</p>
        </div>
      </div>

      {!permission.confirmed && (
        <div className="flex justify-center mt-10 gap-5 text-2xl">
          <button className="w-full button bg-green-500" onClick={() => handleClosePermission(permission.id, '1')}>CON PERMISO</button>
          <button className="w-full button bg-red-500" onClick={() => handleClosePermission(permission.id, '0')}>SIN PERMISO</button>
        </div>
      )}

    </>
  )
}
