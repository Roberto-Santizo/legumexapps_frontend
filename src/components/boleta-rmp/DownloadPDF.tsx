import { PDFDownloadLink } from '@react-pdf/renderer';
import { Download } from 'lucide-react';
import PdfBoletaCampoRMP from './PdfBoletaCampoRMP';
import { BoletaRmpAllInfo } from 'types/rmpDocTypes';
import Spinner from '../utilities-components/Spinner';

interface DownloadPDFProps {
  boleta: BoletaRmpAllInfo;
  buttonLabel?: string;
  buttonClassName?: string;
}

const DownloadPDF: React.FC<DownloadPDFProps> = ({
  boleta,
  buttonClassName
}) => {
  return (
    <PDFDownloadLink
      document={<PdfBoletaCampoRMP boleta={boleta} />}
      fileName={`BOLETA-${boleta.field_data.doc_date}-${boleta.field_data.id}.pdf`}
      className={buttonClassName || "text-blue-600 hover:text-blue-800 underline text-sm"}
    >
      {({ loading }) => (
        loading ? <Spinner /> : <div className='flex gap-5'><Download /> <p>Descargar Documento</p></div>
      )}
    </PDFDownloadLink>
  );
};

export default DownloadPDF;