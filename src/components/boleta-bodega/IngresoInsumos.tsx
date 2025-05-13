import LogoLegumex from "../logos/LogoLegumex";
import { InsumosReceiptDetails } from "@/api/RecepcionInsumosAPI";

type Props = {
  receipt: InsumosReceiptDetails;
};

export default function IngresoInsumos({ receipt }: Props) {
  const headers = ["Código de insumo", "Unidad medida", "Descripción del insumo", "Unidades ingresadas", "Valor unitario", "Valor total"];

  return (
    <div className=" text-sm print:text-[10px] leading-tight print:leading-tight">
      <div className="p-6 print:p-0 bg-white rounded-lg w-full h-full print:rounded-none">
        <div className="w-full flex flex-col md:flex-row justify-between items-start print:items-start">
          <div className="flex items-start space-x-2 print:space-x-1">
            <div className="w-16 h-12 print:w-14 print:h-10 flex items-center justify-center">
              <LogoLegumex />
            </div>
          </div>
          <div className="text-center mt-4 md:mt-0">
            <h1 className="font-bold text-xl uppercase print:text-base">Ingreso a bodega - insumos</h1>
          </div>
          <div className="text-right">
            <p className="font-bold uppercase text-base print:text-sm">R-ro-bod-01</p>
            <p className="font-bold text-red-500 text-base print:text-sm">
              No: <span>{receipt.data.id}</span>
            </p>
          </div>
        </div>

        <div className="uppercase font-bold w-full mt-6 print:mt-4">
          <p>Agroindustria legumex, S.A.</p>
          <p>12 avenida 6-15 zona 2 sector</p>
          <p>las majadas, el Tejar, Chimaltenango</p>
          <p>PBX: 7824 9300</p>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between mt-6 print:mt-4>">
          <div className="w-full md:w-1/2">
            <p className="font-bold mt-2">
              Fecha de ingreso a bodega:{" "}
              <span className="font-normal border-b border-black inline-block w-40 md:w-64">
                {receipt.data.received_date}
              </span>
            </p>
            <p className="font-bold mt-2">
              Proveedor:{" "}
              <span className="font-normal border-b border-black inline-block w-40 md:w-64">
                {receipt.data.supplier}
              </span>
            </p>
          </div>
          <div className="w-full md:w-1/2">
            <p className="font-bold mt-2">
              Factura:{" "}
              <span className="font-normal border-b border-black inline-block w-40 md:w-64">
                {receipt.data.invoice}
              </span>
            </p>
            <p className="font-bold mt-2">
              Fecha de factura:{" "}
              <span className="font-normal border-b border-black inline-block w-40 md:w-64">
                {receipt.data.invoice_date}
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
              {receipt.data.items.map((item) => (
                <tr key={item.id}>
                  <td className="uppercase border border-black p-1">{item.code}</td>
                  <td className="uppercase border border-black p-1">{item.measure}</td>
                  <td className="uppercase border border-black p-1">{item.name}</td>
                  <td className="uppercase border border-black p-1">{item.units}</td>
                  <td className="uppercase border border-black p-1">{item.unit_value}</td>
                  <td className="uppercase border border-black p-1">{item.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-center gap-10 mt-5 print:mt-3">
          <div className="text-center">
            <img
              className="h-16 print:h-12"
              src={`${import.meta.env.VITE_BASE_URL}/storage/${receipt.data.user_signature}`}
              alt="Firma Receptor"
            />
            <p className="text-sm">Firma Receptor</p>
          </div>
          <div className="text-center">
            <img
              className="h-16 print:h-12"
              src={`${import.meta.env.VITE_BASE_URL}/storage/${receipt.data.supervisor_signature}`}
              alt="Firma Supervisor"
            />
            <p className="text-sm">Firma Supervisor</p>
          </div>
        </div>
      </div>
    </div>
  );
}
