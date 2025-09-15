import { TaskProductionTransaction } from "types/taskProductionPlanTypes";
import LogoLegumex from "../logos/LogoLegumex";

type Props = {
  transaction: TaskProductionTransaction;
}
export default function SalidaBodegaEmpaque({ transaction }: Props) {
  return (
    <div>
      <div className="shadow-xl p-10 bg-white rounded-lg w-full h-full" id="pdfBoletaSalida">
        <div className="flex">
          <div className="flex items-start space-x-4">
            <div className="w-20 md:w-32 h-14 md:h-16 flex items-center justify-center">
              <LogoLegumex />
            </div>
          </div>
          <div className="align-middle flex flex-col items-center justify-center w-full">
            <h1 className="uppercase text-center font-bold text-4xl mb-12 flex flex-col">
              Salida de bodega empaque
              <span className="text-red-500 text-lg">No.{transaction.id}</span>
              <span className="text-red-500 text-lg">Referencia: {transaction.transaction}</span>
            </h1>

          </div>
        </div>
        <div className="w-full flex flex-col md:flex-row justify-between">
          <div className="uppercase font-bold w-1/2 ">
            <p className="upp">Agroindustria legumex, S.A.</p>
            <p>12 avenida 6-15 zona 2 sector </p>
            <p>las majadas, el Tejar, Chimaltenango</p>
            <p>PBX: 7824 9300</p>
          </div>

          <div className="flex items-center gap-10">
            <div>
              <p className="font-bold uppercase mt-6 p-4">Fecha</p>
            </div>
            <div>
              <p className="uppercase text-center font-bold p-3">R.pro.bod.06</p>
              {transaction.transaction_date}
            </div>
          </div>
        </div>

        <div className=" w-full mt-12 space-between">
          <table className="border-collapse table-auto w-full">
            <thead className="bg-gray-300">
              <tr>
                <th className="border border-black uppercase font-bold p-2">
                  Código
                </th>
                <th className="border border-black uppercase font-bold p-2">
                  Descripcion del producto
                </th>
                <th className="border border-black uppercase font-bold p-2">
                  Destino
                </th>
                <th className="border border-black uppercase font-bold p-2">
                  Lote
                </th>
                <th className="border border-black uppercase font-bold p-2">
                  Cantidad
                </th>
              </tr>
            </thead>
            <tbody>
              {transaction.items.map(item => (
                <tr key={item.code}>
                  <td className="border border-black p-2">{item.code}</td>
                  <td className="border border-black p-2">{item.description}</td>
                  <td className="border border-black p-2">{item.destination}</td>
                  <td className="border border-black p-2">{item.lote}</td>
                  <td className="border border-black p-2">{item.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-12">
          <div className="font-bold uppercase mb-12">
            <p>Observaciones:</p>
            <p className="p-2 border-b border-black min-h-[6rem] font-normal">
              {transaction.observations}
            </p>
          </div>
        </div>
        <div className="w-full flex flex-col md:flex-row  justify-center md:justify-between">
          <div>
            <p className="uppercase font-bold">
              Encargado Bodega:
              <span className="font-normal capitalize ml-2">
                {transaction.delivered_by}
              </span>
            </p>
            <div className="text-center">
              <div className="border-b border-black h-16 md:h-20 flex items-center justify-center">
                <img
                  className="h-16 print:h-12"
                  src={`${import.meta.env.VITE_AWS_BUCKET_URL}signatures/${transaction.delivered_by_signature}`}
                  alt="Firma Entregado Por"
                />
              </div>
              <p className="mt-2 font-bold">FIRMA</p>
            </div>
          </div>
          <div>
            <p className="uppercase font-bold">
              Responsable:
              <span className="capitalize font-normal ml-2">
                {transaction.responsable}
              </span>
            </p>
            <div className="text-center">
              <div className="border-b border-black h-16 md:h-20 flex items-center justify-center">
                <img
                  className="h-16 print:h-12"
                  src={`${import.meta.env.VITE_AWS_BUCKET_URL}signatures/${transaction.responsable_signature}`}
                  alt="Firma Receptor Cajas"
                />
              </div>
              <p className="mt-2 font-bold">FIRMA</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
