import { pdf } from '@react-pdf/renderer';
import PdfBoletaCampoRMP from './PdfBoletaCampoRMP';
import { BoletaInfoAll } from '@/api/ReceptionsDocAPI';

export async function AutoDownloadPDF(boleta: BoletaInfoAll) {
  const blob = await pdf(<PdfBoletaCampoRMP boleta={boleta} />).toBlob();//es como un archivo temporal en la memoria del navegador
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;//descarga el archivo desde esta URL temporal
  a.download = `boleta-${boleta.field_data.id}.pdf`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url); //Libera la memoria que ocupaba esa URL temporal
}

