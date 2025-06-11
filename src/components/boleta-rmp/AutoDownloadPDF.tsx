import { pdf } from '@react-pdf/renderer';
import PdfBoletaCampoRMP from './PdfBoletaCampoRMP';
import { BoletaInfoAll } from '@/api/ReceptionsDocAPI';

export async function AutoDownloadPDF(boleta: BoletaInfoAll) {
  const blob = await pdf(<PdfBoletaCampoRMP boleta={boleta} />).toBlob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `boleta-${boleta.field_data.id}.pdf`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

