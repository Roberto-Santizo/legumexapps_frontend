import { useParams, useSearchParams } from "react-router-dom";
import { getDraftWeeklyPlanById } from "@/api/PlannerFincasAPI";
import { useQuery } from "@tanstack/react-query";
import { ChangeEvent, useCallback, useState } from "react";
import ModalEditTask from "../components/ModalEditTask";
import debounce from "debounce";



export default function Show() {
  const params = useParams();
  const id = params.id!;
  const [searchParams, setSearchParams] = useSearchParams();
  const [filter, setFilter] = useState<string>(searchParams.get('cdp') ?? '');

  const { data, isLoading } = useQuery({
    queryKey: ['getDraftWeeklyPlanById', id, searchParams.get('cdp')],
    queryFn: () => getDraftWeeklyPlanById({ id: parseInt(id), filter: searchParams.get('cdp') ?? '' })
  });

  const debouncedChange = useCallback(
    debounce((value: string) => {
      setSearchParams(`?cdp=${value}`);
    }, 750),
    []
  );

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFilter(e.target.value);
    debouncedChange(e.target.value);
  };

  if (isLoading) return <SkeletonLoading />;
  if (data) return (
    <>
      <section className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 bg-white p-4 rounded-2xl shadow-md border border-gray-200">
        <div>
          <p className="text-2xl font-bold text-gray-800">{data.finca}</p>
          <p className="text-lg font-semibold text-gray-600">Semana {data.week}</p>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="text"
            value={filter}
            placeholder="Filtrar cdp"
            onChange={handleChange}
            className="px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all w-60"
          />
        </div>
      </section>


      <section className="flex flex-col gap-5 mt-5">
        {Object.entries(data.tasks ?? []).map(([cdp, tasks]) => (
          <div key={cdp} className="p-5">
            <h1 className="font-bold text-center uppercase text-xl mb-5">{cdp}</h1>

            <table className="table mt-10">
              <thead>
                <tr className="thead-tr">
                  <th scope="col" className="thead-th">
                    Tarea
                  </th>
                  <th scope="col" className="thead-th">
                    Receta
                  </th>
                  <th scope="col" className="thead-th">
                    Presupuesto
                  </th>
                  <th scope="col" className="thead-th">
                    Horas
                  </th>
                  <th scope="col" className="thead-th">
                    Cupos
                  </th>
                  <th scope="col" className="thead-th">
                    Etiquetas
                  </th>

                </tr>
              </thead>
              <tbody>
                {tasks.map((task) => (
                  <tr className="tbody-tr" key={task.id} onClick={() => setSearchParams(searchParams => {
                    searchParams.set('editTask', task.id.toString());
                    return searchParams;
                  })}>
                    <td className="tbody-td">
                      <p>{task.task}</p>
                    </td>
                    <td className="tbody-td">
                      <p>{task.recipe}</p>
                    </td>
                    <td className="tbody-td">
                      <p>{task.budget}</p>
                    </td>
                    <td className="tbody-td">
                      <p>{task.hours}</p>
                    </td>
                    <td className="tbody-td">
                      <p>{task.slots}</p>
                    </td>
                    <td className="tbody-td">
                      {task.tags?.split(',').map((tag, index) => (
                        <p key={index} className="bg-red-500 text-white font-bold text-center uppercase text-xs m-1 rounded p-0.5">{tag}</p>
                      ))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </section>

      <button className="button bg-indigo-500 w-full mt-5 hover:bg-indigo-600">
        Confirmar Plan
      </button>

      <ModalEditTask />
    </>
  )
}


function SkeletonLoading() {
  return (
    <>
      <section className="animate-pulse space-y-2">
        <div className="h-6 w-1/3 bg-gray-200 rounded"></div>
        <div className="h-5 w-1/4 bg-gray-200 rounded"></div>
      </section>

      <section className="flex flex-col gap-5 mt-5 animate-pulse">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="p-5 border rounded-xl bg-white shadow-sm">
            <div className="h-6 w-1/2 mx-auto bg-gray-200 rounded mb-5"></div>

            <div className="space-y-3">
              {[...Array(4)].map((_, rowIndex) => (
                <div
                  key={rowIndex}
                  className="flex justify-between gap-4 border-b pb-2"
                >
                  {[...Array(4)].map((_, colIndex) => (
                    <div
                      key={colIndex}
                      className="h-4 bg-gray-200 rounded w-1/5"
                    ></div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>

      <div className="mt-5">
        <div className="h-10 bg-gray-200 rounded w-full animate-pulse"></div>
      </div>
    </>

  )
}

