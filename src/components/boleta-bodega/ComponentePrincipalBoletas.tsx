import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import SalidaBodegaEmpaque from "@/components/boleta-bodega/SalidaBodegaEmpaque";
import DevolucionBodega from "@/components/boleta-bodega/DevolucionBodega";

export default function ComponentePrincipalBoletas() {
  const salidaBodega = () => {
    const input = document.getElementById("pdfBoletaSalida");
    if (!input) {
      console.error('Element with id "pdfBoletaSalida" not found.');
      return;
    }
    html2canvas(input, { logging: true, useCORS: true }).then((canvas) => {
      const imgWidth = 208;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      pdf.save("boleta-salida.pdf");
    });
  };

  const boletaDeDevolucion =()=>{
    const input = document.getElementById("pdfBoletaDevolucion");
    if (!input) {
      console.error('Element with id "pdfBoletaDevolucion" not found.');
      return;
    }
    html2canvas(input, { logging: true, useCORS: true }).then((canvas) => {
      const imgWidth = 208;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      pdf.save("devolucion-bodega.pdf");
    });
  }

  return (
    <>
      <div>
        <div>
          <button
            className="bg-blue-500 text-white font-bold py-2 px-4 rounded mt-4"
            onClick={salidaBodega}
          >
            Descargar PDF
          </button>
          <div
            id="pdfBoletaSalida"
          >
            <SalidaBodegaEmpaque/>
          </div>
        </div>
      </div>

      <div>
        <div>
          <button
            className="bg-blue-500 text-white font-bold py-2 px-4 rounded mt-4"
            onClick={boletaDeDevolucion}
          >
            Descargar PDF
          </button>
          <div
            id="pdfBoletaDevolucion"
          >
            <DevolucionBodega/>
          </div>
        </div>
      </div>
    </>
  );
}


