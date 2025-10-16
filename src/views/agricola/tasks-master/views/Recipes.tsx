import { getRecipes } from "../api/api";
import { Link } from "react-router-dom";
import { PlusIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import Table from "@/components/shared/Table";
import SkeletonLoading from "../components/SkeletonLoading";

export default function Recipes() {

  const { data, isLoading } = useQuery({
    queryKey: ['getRecipes'],
    queryFn: getRecipes
  });

  if (isLoading) return <SkeletonLoading />
  if (data) return (
    <div>
      <h2 className="text-4xl font-bold">Recetas</h2>
      <section className="flex justify-end items-center">
        <Link to={`${location.pathname}/crear`} className="button bg-indigo-500 hover:bg-indigo-600 mt-5 flex justify-center items-center gap-2">
        <PlusIcon />
          <p>Crear Receta</p>
        </Link>
      </section>
      <Table data={data.data} columns={['name']} />
    </div>
  )
}
