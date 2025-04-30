import { PlusIcon } from "lucide-react";
import { Link } from "react-router-dom";



export default function IndexMaterialEmpaque() {

  return (
    <>
      <h1 className="font-bold text-3xl uppercase">Material de empaque</h1>
      <div className="flex flex-col md:flex-row justify-end items-center gap-3 mt-10">
        <Link
          to="/material-empaque/ingreso"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded uppercase flex justify-center items-center"
        >
          <PlusIcon className="w-6 md:w-8" />
          <p className="text-sm md:text-base">Registrar material de empaque</p>
        </Link>
      </div>

      <table className="table mt-10">
        <thead>
          <tr className="thead-tr">
            <th className="thead-th">Nombre</th>
            <th className="thead-th">Descripcion</th>
            <th className="thead-th">código</th>
            <th className="thead-th">Bloqueo</th>
          </tr>
        </thead>
        <tbody>
          {/* {pilotos.map(piloto => ( */}
            <tr className="tbody-tr">
              <td className="tbody-td"></td>
              <td className="tbody-td"></td>
              <td className="tbody-td"></td>
              <td className="tbody-td"></td>
            </tr>
          {/* ))} */}
        </tbody>
      </table>

      <div className="mt-5 mb-10 flex justify-center md:justify-end">
        {/* <Pagination
        //   currentPage={1}
        //   pageCount={10}
        //   handlePageChange={(page) => console.log(`Page changed to: ${page}`)}
        /> */}
      </div>
    </>
  )
}
