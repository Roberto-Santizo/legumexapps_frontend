import html2canvas from "html2canvas";
import LogoLegumex from "../logos/LogoLegumex";
import jsPDF from "jspdf";
import { ReceptionPackigMaterial } from "@/api/ReceptionPackingMaterialsAPI";

type Props = {
  data: ReceptionPackigMaterial;
}

export default function BoletaIngresoMaterialEmpaque({ data }: Props) {
  const ingresoMaterialEmpaque = () => {
    const input = document.getElementById("pdfIngresoMaterialEmpaque");
    if (!input) {
      console.error('Element with id "pdfIngresoMaterialEmpaque" not found.');
      return;
    }
    html2canvas(input, { logging: true, useCORS: true }).then((canvas) => {
      const imgWidth = 208;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      pdf.save("ingreso-material-empaque.pdf");
    });
  }
  return (
    <div>
      <button
        className="bg-blue-500 text-white font-bold py-2 px-4 rounded mt-4"
        onClick={ingresoMaterialEmpaque}

      >
        Descargar PDF
      </button>
      <div
        id="pdfIngresoMaterialEmpaque"
      >
        <div className="mt-12">
          <div className="shadow-xl p-10 bg-white rounded-lg w-full h-full">
            <div className="flex">
              <div className="flex items-start space-x-4">
                <div className="w-20 md:w-32 h-14 md:h-16 flex items-center justify-center">
                  <LogoLegumex />
                </div>
              </div>
              <div className="align-middle flex flex-col items-center justify-center w-full">
                <h1 className="uppercase text-center font-bold text-4xl mb-12">
                  Ingreso a bodega material de empaque
                </h1>
                <p className="font-bold text-2xl text-center text-red-500">
                  {`No.${data.id}`}
                </p>
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
                <div className="mt-16">
                  <p className="font-bold uppercase">Fecha ingreso: {data.receipt_date}</p>
                  <p className="font-bold uppercase mt-3">Fecha factura: {data.invoice_date}</p>
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
                      Proveedor
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
                  {data.items.map((item) => (
                    <tr key={item.id}>
                      <td className="border border-black p-2">{item.code}</td>
                      <td className="border border-black p-2">{item.description}</td>
                      <td className="border border-black p-2">{item.supplier}</td>
                      <td className="border border-black p-2">{item.lote}</td>
                      <td className="border border-black p-2">{item.quantity}</td>
                    </tr>
                  ))}

                  <tr>
                    <td></td>
                    <td></td>
                    <td className="text-right uppercase font-bold pr-5">Valor Unitario</td>
                    <td className="border border-black p-2 font-bold" colSpan={2}>1</td>
                  </tr>
                  <tr>
                    <td></td>
                    <td></td>
                    <td className="text-right uppercase font-bold pr-5">Valor Total</td>
                    <td className="border border-black p-2 font-bold" colSpan={2}>1</td>
                  </tr>
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
            <div className="w-full flex flex-col md:flex-row  justify-center md:justify-between">
              <div>
                <p className="uppercase font-bold">
                  Recibido por:
                  <span className="font-normal capitalize ml-2">
                    {data.received_by}
                  </span>
                </p>
                <div className="text-center">
                  <div className="border-b border-black h-16 md:h-30 flex items-center justify-center ">
                    <p>{data.received_by_signature}</p>
                    {/* <img
                      alt="Firma ******* confirmar la firma"
                      className="max-h-25 md:max-h-25 object-contain"
                    /> */}
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
                    <p>{data.supervisor_signature}</p>
                    {/* <img
                      alt="Firma ******* confirmar la firma"
                      className="max-h-25 md:max-h-25 object-contain"
                    /> */}
                  </div>
                  <p className="mt-2 font-bold uppercase">FIRMA v.b</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  );
}
