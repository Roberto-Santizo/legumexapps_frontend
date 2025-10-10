import { BoletaRmpAllInfo } from '@/types/rmpDocTypes';
import { pdf } from '@react-pdf/renderer';
import PdfBoletaCampoRMP from './PdfBoletaCampoRMP';

export async function AutoDownloadPDF(boleta: BoletaRmpAllInfo) {
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

