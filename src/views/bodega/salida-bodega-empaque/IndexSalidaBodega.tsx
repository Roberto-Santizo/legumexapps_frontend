import { PlusIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { Bars3Icon } from "@heroicons/react/16/solid";

import FiltersReceptionsInsumos from "@/components/filters/FiltersInsumosBodega";

export type FiltersReceptionsInsumos = {
  invoice: string;
  received_by: string;
  received_date: string;
  invoice_date: string;
};

export default function IndexInsumos() {

  return (
    <>
      <h1 className="font-bold text-4xl capitalize">
        Entrega de material de empaque -salida
      </h1>
      <div className="flex flex-col md:flex-row justify-end items-center gap-3 mt-10">
        <Link
          to="/materialSalida/crear"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded uppercase flex justify-center items-center"
        >
          <PlusIcon className="w-6 md:w-8" />
          <p className="text-sm md:text-base">Crear</p>
        </Link>
        <Bars3Icon
          className="w-6 md:w-8 cursor-pointer hover:text-gray-500"
          // onClick={() => setModal(true)} {/* Agregar la funcion de FilterMaterialSalida.tsx */}
        />
      </div>

      <table className="table mt-10">
        <thead>
          <tr className="thead-tr">
            <th className="thead-th">Referencia</th>
            <th className="thead-th">Responsable de bolsa</th>
            <th className="thead-th">Responsable de caja</th>
            <th className="thead-th">Observaciones</th>
          </tr>
        </thead>
        <tbody>
          <tr className="tbody-tr">
            <td className="tbody-td">Insertar dato aca</td>
            <td className="tbody-td">Insertar dato aca</td>
            <td className="tbody-td">Insertar dato aca</td>
            <td className="tbody-td">Insertar dato aca</td>
          </tr>
        </tbody>
      </table>
      {/*insertar aca el codigo para el filtro*/} 
    </>
  );
}
