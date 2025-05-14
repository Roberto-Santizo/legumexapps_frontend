import LogoLegumex from "../logos/LogoLegumex";
import { ReceptionPackigMaterial } from "@/api/ReceptionPackingMaterialsAPI";

type Props = {
  data: ReceptionPackigMaterial;
};

export default function BoletaIngresoMaterialEmpaque({ data }: Props) {
  const headers = [
    "CÓDIGO",
    "DESCRIPCION DEL PRODUCTO",
    "PROVEEDOR",
    "LOTE",
    "CANTIDAD",
  ];
  return (
    <div className=" text-sm print:text-[10px] leading-tight print:leading-tight">
      <div className="p-6 print:p-0 bg-white rounded-lg w-full h-full print:rounded-none">
        <div className="w-full flex md:flex-col md:mt-5">
          <div className="flex flex-col sm:flex-row">
            <div className="relative sm:absolute sm:left-20">
              <div className="w-20 h-16 print:w-14 print:h-10 flex items-center justify-center">
                <LogoLegumex />
              </div>
            </div>
            <div className="mx-auto text-center">
              <h1 className="font-bold text-xl uppercase print:text-base">
                Ingreso a bodega material de empaque
              </h1>
            </div>
          </div>
          <div className="text-center mt-4 sm:mt-5">
            <p className="font-bold text-base text-red-500 uppercase print:text-sm">
              NO.<span>{data.id}</span>
            </p>
          </div>
        </div>

        <div className="uppercase font-bold w-full mt-6 print:mt-4">
          <p>Agroindustria legumex, S.A.</p>
          <p>12 avenida 6-15 zona 2 sector</p>
          <p>las majadas, el Tejar, Chimaltenango</p>
          <p>PBX: 7824 9300</p>
        </div>

        <div className=" w-full flex flex-col md:flex-row  mt-6 mb-4 print:mt-4 justify-end">
          <div className="md:w-1/2">
            <p className="font-bold mt-2 text-right">
              Fecha de ingreso a bodega:{" "}
              <span className="font-normal border-b border-black inline-block w-40 md:w-64 text-center">
                {data.receipt_date}
              </span>
            </p>
            <p className="font-bold mt-2 text-right">
              Fecha Factura:{" "}
              <span className="font-normal border-b border-black inline-block w-40 md:w-64 text-center">
                {data.invoice_date}
              </span>
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full table-fixed mt-6 print:mt-4 border-collapse border border-black">
            <thead className="bg-gray-300 print:bg-gray-200">
              <tr>
                {headers.map((header, idx) => (
                  <th
                    key={idx}
                    className="uppercase font-bold border border-black p-1 text-[10px]"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.items.map((item) => (
                <tr key={item.id}>
                  <td className="border border-black p-2 uppercase">
                    {item.code}
                  </td>
                  <td className="border border-black p-2 uppercase">
                    {item.description}
                  </td>
                  <td className="border border-black p-2 uppercase">
                    {item.supplier}
                  </td>
                  <td className="border border-black p-2 uppercase">
                    {item.lote}
                  </td>
                  <td className="border border-black p-2 uppercase">
                    {item.quantity}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-12">
          <div className="font-bold uppercase mb-12">
            <p>Observaciones:</p>
            <p className="p-2 border-b border-black min-h-[6rem] font-normal">
              {data.observations}
            </p>
          </div>
        </div>
        <div className="w-full flex flex-row justify-center gap-x-36">
          <div>
            <p className="uppercase font-bold">
              Recibido por:
              <span className="font-normal capitalize ml-2">
                {data.received_by}
              </span>
            </p>
            <div className="text-center">
              <div className="border-b border-black h-16 md:h-30 flex items-center justify-center ">
                <img
                  className="h-16 print:h-12"
                  src={`${import.meta.env.VITE_BASE_URL}/storage/${
                    data.received_by_signature
                  }`}
                  alt="Firma Receptor"
                />
              </div>
              <p className="mt-2 font-bold uppercase">FIRMA</p>
            </div>
          </div>
          <div>
            <p className="uppercase font-bold">
              Nombre del Supervisor:
              <span className="capitalize font-normal ml-2">
                {data.supervisor_name}
              </span>
            </p>
            <div className="text-center">
              <div className="border-b border-black h-16 md:h-30 flex items-center justify-center">
                <img
                  className="h-16 print:h-12"
                  src={`${import.meta.env.VITE_BASE_URL}/storage/${
                    data.supervisor_signature
                  }`}
                  alt="Firma Supervisor"
                />
              </div>
              <p className="mt-2 font-bold uppercase">FIRMA v.b</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
