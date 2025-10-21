import { SkeletonLoading, IndexFilters, ModalUploadTasksGuidelines } from "@/views/agricola/tasks-master/components/components";
import { Link, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query"
import { getTasksGuidelines } from "../api/api";
import { useEffect, useState } from "react";
import { PlusIcon } from "lucide-react";
import { Bars3Icon } from "@heroicons/react/16/solid";
import { useTasksMasterFilters } from "../hooks/useTasksMasterFilters";
import Pagination from "@/components/shared/Pagination";

export default function Index() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [page, setPage] = useState<number>(parseInt(searchParams.get('page') ?? '0') ?? 0);
    const [rowsPerPage, setRowsPerPage] = useState<number>(parseInt(searchParams.get('rowsPerPage') ?? '10') ?? 10);
    const [count, setCount] = useState<number>(0);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const { filters, setFilters, resetFilters } = useTasksMasterFilters();

    const { data, isLoading } = useQuery({
        queryKey: ['getTasksGuidelines', page, rowsPerPage, filters],
        queryFn: () => getTasksGuidelines({ page, limit: rowsPerPage, filters })
    });

    const handleChangePage = (_: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
        setSearchParams((searchParams) => {
            searchParams.set('page', newPage.toString())
            return searchParams;
        });
        setPage(newPage);
    };

    const handleOnRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setSearchParams({ rowsPerPage: event.target.value });
        setPage(0);
    }

    const handleOpenModal = () => {
        setSearchParams((searchParams) => {
            searchParams.set('upload', "true");
            return searchParams;
        });
    }

    useEffect(() => {
        setCount(data?.meta?.total ?? 100);
    }, [data]);

    if (isLoading) return <SkeletonLoading />;
    if (data) return (
        <div>
            <h2 className="text-4xl font-bold">Maestro de Tareas</h2>

            <section className="flex justify-between items-center">
                <div className="flex gap-5">
                    <button className="button bg-indigo-500 hover:bg-indigo-600 mt-5 flex justify-center items-center gap-2" onClick={() => handleOpenModal()}>
                        <PlusIcon />
                        <p>Cargar Tareas</p>
                    </button>

                    <Link to={`${location.pathname}/crear`} className="button bg-indigo-500 hover:bg-indigo-600 mt-5 flex justify-center items-center gap-2">
                        <PlusIcon />
                        <p>Crear Tarea Maestra</p>
                    </Link>

                    <Link to={`${location.pathname}/recetas`} className="button bg-indigo-500 hover:bg-indigo-600 mt-5 flex justify-center items-center gap-2">
                        <p>Recetas</p>
                    </Link>
                    <Link to={`${location.pathname}/cultivos`} className="button bg-indigo-500 hover:bg-indigo-600 mt-5 flex justify-center items-center gap-2">
                        <p>Cultivos</p>
                    </Link>
                </div>
                <Bars3Icon
                    className="w-6 md:w-8 cursor-pointer hover:text-gray-500"
                    onClick={() => setIsOpen(true)}
                />
            </section>

            <table className="table mt-10">
                <thead>
                    <tr className="thead-tr">
                        <th scope="col" className="thead-th">
                            Tarea
                        </th>
                        <th scope="col" className="thead-th">
                            Presupuesto
                        </th>
                        <th scope="col" className="thead-th">
                            Horas
                        </th>
                        <th scope="col" className="thead-th">
                            Receta
                        </th>
                        <th scope="col" className="thead-th">
                            Cultivo
                        </th>
                        <th scope="col" className="thead-th">
                            Finca
                        </th>
                        <th scope="col" className="thead-th">
                            Semana de Aplicación
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {data.data.map((item) => (
                        <tr className="tbody-tr" key={item.id}>
                            <td className="tbody-td">{item.task}</td>
                            <td className="tbody-td">{item.budget}</td>
                            <td className="tbody-td">{item.hours}</td>
                            <td className="tbody-td">{item.recipe}</td>
                            <td className="tbody-td">{item.crop}</td>
                            <td className="tbody-td">{item.finca}</td>
                            <td className="tbody-td">{item.week}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <Pagination count={count} page={page} rowsPerPage={rowsPerPage} handleOnPageChange={handleChangePage} handleOnRowsPerPageChange={handleOnRowsPerPageChange} />
            <IndexFilters isOpen={isOpen} setIsOpen={setIsOpen} currentFilters={filters} onApply={setFilters} resetFilters={resetFilters} />
            <ModalUploadTasksGuidelines />
        </div>
    )
}
