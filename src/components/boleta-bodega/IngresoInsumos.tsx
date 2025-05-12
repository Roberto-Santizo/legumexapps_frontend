import LogoLegumex from "../logos/LogoLegumex";
import { InsumosReceiptDetails } from "@/api/RecepcionInsumosAPI";

type Props = {
  receipt: InsumosReceiptDetails;
}

export default function IngresoInsumos({ receipt }: Props) {
  return (
    <div>
      <div
        id="pdfIngresoInsumos"
      >
        <div className="shadow-xl p-10 bg-white rounded-lg w-full h-full">
          <div className="w-full flex flex-col md:flex-row justify-between ">
            <div className="flex items-start space-x-4">
              <div className="w-20 md:w-32 h-14 md:h-16 flex items-center justify-center">
                <LogoLegumex />
              </div>
            </div>
            <div>
              <h1 className="font-bold text-4xl uppercase">Ingreso a bodega - insumos</h1>
            </div>
            <div>
              <p className="font-bold uppercase text-2xl">R-ro-bod-01</p>
              <p className="font-bold text-red-500 text-2xl">
                No: <span>{receipt.data.id}</span>{" "}
              </p>
            </div>
          </div>
          <div className="uppercase font-bold w-1/2 mt-10">
            <p className="upp">Agroindustria legumex, S.A.</p>
            <p>12 avenida 6-15 zona 2 sector </p>
            <p>las majadas, el Tejar, Chimaltenango</p>
            <p>PBX: 7824 9300</p>
          </div>
          <div className="flex flex-col md:flex-row justify-between mt-10 ">
            <div className="w-3/6">
              <p className="font-bold mt-5">
                Fecha: de ingreso a bodega:{" "}
                <span className="font-normal capitalize border-b border-black p-2 inline-block w-40 md:w-80">{receipt.data.received_date}</span>
              </p>
              <p className="font-bold mt-5">
                Proveedor:{" "}
                <span className="font-normal capitalize border-b border-black p-2 inline-block w-40 md:w-80">{receipt.data.supplier}</span>
              </p>
            </div>
            <div>
              <p className="font-bold mt-5">
                Factura:{" "}
                <span className="font-normal capitalize border-b border-black p-2 inline-block w-40 md:w-80">{receipt.data.invoice}</span>
              </p>
              <p className="font-bold mt-5">
                Fecha de factura:{" "}
                <span className="font-normal capitalize border-b border-black p-2 inline-block w-40 md:w-80">{receipt.data.invoice_date}</span></p>
            </div>
          </div>
          <div>
            <table className="w-full table-auto mt-12">
              <thead className="bg-gray-300">
                <tr>
                  <th className="uppercase font-bold border border-black p-2">
                    Rubro
                  </th>
                  <th className="uppercase font-bold border border-black p-2">
                    Codigo de insumo
                  </th>
                  <th className="uppercase font-bold border border-black p-2">
                    Unidad Medida
                  </th>
                  <th className="uppercase font-bold border border-black p-2">
                    Descripcion del insumo
                  </th>
                  <th className="uppercase font-bold border border-black p-2">
                    Unidades ingresadas
                  </th>
                  <th className="uppercase font-bold border border-black p-2">
                    Valor unitario
                  </th>
                  <th className="uppercase font-bold border border-black p-2">
                    Valor total
                  </th>
                </tr>
              </thead>
              <tbody>
                {receipt.data.items.map(item => (
                  <tr key={item.id}>
                    <td className="uppercase border border-black p-2">
                      Suministro
                    </td>
                    <td className="uppercase border border-black p-2">
                      {item.code}
                    </td>
                    <td className="uppercase border border-black p-2">
                      {item.measure}
                    </td>
                    <td className="uppercase border border-black p-2">
                      {item.name}
                    </td>
                    <td className="uppercase border border-black p-2">
                      {item.units}
                    </td>
                    <td className="uppercase border border-black p-2">
                      {item.unit_value}
                    </td>
                    <td className="uppercase border border-black p-2">
                      {item.total}
                    </td>
                  </tr>
                ))}

              </tbody>
            </table>
          </div>
          <div className="flex justify-center gap-10 mt-5">
            <div className="p-2 text-center">
              <img src={`${import.meta.env.VITE_BASE_URL}/storage/${receipt.data.user_signature}`} alt="Signature" />
              <p className="text-lgSS">Firma Receptor</p>
            </div>

            <div className="p-2 text-center">
              <img src={`${import.meta.env.VITE_BASE_URL}/storage/${receipt.data.supervisor_signature}`} alt="Signature" />
              <p className="text-lgSS">Firma Supervisor</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
