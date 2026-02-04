import { getCrops } from "../../api/api";
import { Link } from "react-router-dom";
import { PlusIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import Spinner from "@/components/utilities-components/Spinner";
import Table from "../../components/crops/Table";
import Title from "@/components/shared/Title";

export default function Index() {
  const { data, isLoading } = useQuery({
    queryKey: ['getCrops'],
    queryFn: getCrops
  });

  if (isLoading) return <Spinner />

  if (data) return (
    <div>
      <Title title="Cultivos" size="text-4xl" />

      <div className="flex justify-end mt-4">
        <Link className="button bg-indigo-600 hover:bg-indigo-800 flex gap-2" to={'/cultivos/crear'}>
          <PlusIcon />
          Crear
        </Link>
      </div>

      <Table data={data} />
    </div>
  )
}
