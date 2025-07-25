import React from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { Download } from 'lucide-react';
import { BoletaInfoAll } from '@/api/ReceptionsDocAPI';
import PdfBoletaCampoRMP from './PdfBoletaCampoRMP';
import Spinner from '../utilities-components/Spinner';

interface DownloadPDFProps {
  boleta: BoletaInfoAll;
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
      fileName={`boleta-${boleta.field_data.id}.pdf`}
      className={buttonClassName || "text-blue-600 hover:text-blue-800 underline text-sm"}
    >
      {({ loading }) => (
        loading ? <Spinner /> : <div className='flex gap-5'><Download /> <p>Descargar Documento</p></div>
      )}
    </PDFDownloadLink>
  );
};

export default DownloadPDF;