import { useQuery } from "@tanstack/react-query";
import { getCrops } from "../api/api";
import SkeletonLoading from "../components/SkeletonLoading";
import Table from "@/components/shared/Table";
import { Link } from "react-router-dom";
import { PlusIcon } from "lucide-react";

export default function Crops() {
  const { data, isLoading } = useQuery({
    queryKey: ['getCrops'],
    queryFn: getCrops
  });

  if (isLoading) return <SkeletonLoading />
  if (data) return (
    <div>
      <h2 className="text-4xl font-bold">Cultivos</h2>
      <section className="flex justify-end items-center">
        <Link to={`${location.pathname}/crear`} className="button bg-indigo-500 hover:bg-indigo-600 mt-5 flex justify-center items-center gap-2">
          <PlusIcon />
          <p>Crear Cultivo</p>
        </Link>
      </section>
      <Table data={data} columns={['code', 'name']} />
    </div>
  )
}
