import { PlusIcon, Edit } from "lucide-react";
// import Pagination from "@/components/Pagination";
import { Link } from "react-router-dom";



export default function IndexLineas() {

  return (
    <>
      <h2 className="font-bold text-4xl">lineas</h2>

      <div className="flex flex-row justify-end gap-5 mb-5">
        <div className="flex flex-row justify-end gap-5">
          <Link
            to="/lineas/CrearLinea"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-5 uppercase flex justify-center items-center"
          >
            <PlusIcon className="w-8" />
            <p>crear lineas</p>
          </Link>
        </div>
      </div>

      <div className="mt-10">
        <table className="table">
          <thead>
            <tr className="thead-tr">
              <th scope="col" className="thead-th">codigo</th>
              <th scope="col" className="thead-th">total de personas</th>
              <th scope="col" className="thead-th">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr className="tbody-tr">
              <td className="tbody-td">1</td>
              <td className="tbody-td">1</td>
              <td className="tbody-td flex gap-5">
                <Link to={`/lineas/EditarLineas`}> {/* El link de esta linea debe de ser corregido porque solo se coloco como guia mas no funciona*/}
                  <Edit className="hover:text-gray-500" />
                </Link>
              </td>
            </tr>
            {/* ))} */}
          </tbody>
        </table>
        <div className="mb-10 flex justify-end">
          {/* <Pagination
            currentPage={currentPage}
            pageCount={pageCount}
            handlePageChange={handlePageChange}
          /> */}
        </div>
      </div>
    </>
  )
}
