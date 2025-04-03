import { getAllLines, getLinePerformanceByDay } from "@/api/LineasAPI";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import ShowErrorAPI from "@/components/ShowErrorAPI";
import Spinner from "@/components/Spinner";
import { Eye } from "lucide-react";
import { Link } from "react-router-dom";
import { getYesterdayDate } from "@/helpers";

const colores = {
  "HBiometrico": "bg-orange-500",
  "HPlan": "bg-blue-500",
  "HLinea": "bg-yellow-400",
  "HRendimiento": "bg-lime-600",
};

const initialValues = {
  HBiometrico: 0,
  HPlan: 0,
  HLinea: 0,
  HRendimiento: 0,
};

type GraphDataType = {
  HBiometrico: number,
  HPlan: number,
  HLinea: number,
  HRendimiento: number,
}

export default function DailyGraphs() {
  const [graphData, setGraphData] = useState<GraphDataType>(initialValues);
  const [lineId, setLineId] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [valorMaximo, setValorMaximo] = useState<number>(0);

  const { data, isFetching } = useQuery({
    queryKey: ['getPerformanceByDay', lineId, date],
    queryFn: () => getLinePerformanceByDay(lineId, date),
    enabled: !!date && !!lineId
  });

  const { data: lines, isLoading, isError } = useQuery({
    queryKey: ['getAllLines'],
    queryFn: getAllLines
  });

  useEffect(() => {
    if (data) {
      setGraphData(data.summary);
      setValorMaximo(data.max_value)
    }
  }, [data]);

  if (isLoading) return <Spinner />;
  if (isError) return <ShowErrorAPI />;
  if (lines) return (
    <div>
      <h1 className="text-2xl font-bold text-center mb-8 uppercase">Gráficas Diarias</h1>

      <div className="flex mb-6">
        <input
          type="date"
          className="p-2 border border-gray-300 rounded-lg mr-4 w-1/2"
          onChange={(e) => (setDate(e.target.value))}
          max={getYesterdayDate()}
        />
        <select className="p-2 border border-gray-300 rounded-lg mr-4 bg-white w-1/2" onChange={(e) => (setLineId(e.target.value))}>
          <option value={''}>--SELECCIONE UNA LINEA--</option>
          {lines.map(line => (
            <option key={line.value} value={line.value}>{line.label}</option>
          ))}
        </select>
        {isFetching && <Spinner />}
      </div>

      <div className="p-6 bg-white rounded-lg shadow-lg mx-auto ">
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex justify-between h-64 bg-gray-50 p-4 rounded-lg">
            {(Object.keys(graphData) as Array<keyof typeof graphData>).map(
              (tipo, index) => {
                const altura = (graphData[tipo] / valorMaximo) * 100;
                return (
                  <div key={index} className="flex flex-col items-center">
                    <div className="h-full flex flex-col justify-end">
                      <div
                        className={`${colores[tipo]} w-16 rounded-t-sm mb-2`}
                        style={{ height: `${altura}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-center">
                      {graphData[tipo]}
                    </span>
                    <span className="text-xs text-gray-600 mt-1">{tipo}</span>
                  </div>
                );
              }
            )}
          </div>
        </div>

        <div className="mt-8 flex justify-center gap-6 flex-wrap">
          {(Object.keys(colores) as Array<keyof typeof colores>).map(
            (tipo, index) => (
              <div key={index} className="flex items-center">
                <div className={`w-4 h-4 ${colores[tipo]} mr-2`}></div>
                <span className="text-sm">{tipo}</span>
              </div>
            )
          )}
        </div>
      </div>

      <table className="table mt-10">
        <thead>
          <tr className="thead-tr">
            <th className="thead-th">SKU</th>
            <th className="thead-th">Descripción</th>
            <th className="thead-th">Fecha de Inicio</th>
            <th className="thead-th">Fecha Final</th>
            <th className="thead-th">Acción</th>
          </tr>
        </thead>
        <tbody>
          {data?.details?.map(task => (
              <tr key={task.id} className="tbody-tr">
                  <td className="tbody-td">{task.sku}</td>
                  <td className="tbody-td">{task.sku_description}</td>
                  <td className="tbody-td">{task.start_date}</td>
                  <td className="tbody-td">{task.end_date}</td>
                  <td className="tbody-td">
                    <Link to={`/planes-produccion/tarea-produccion/${task.id}`} target="_blank">
                      <Eye className="hover:text-gray-500 cursor-pointer"/>
                    </Link>
                  </td>
              </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
