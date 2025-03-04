import React from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import type { BoletaInfoAll } from "@/types";
import PdfBoletaCampoRMP from './PdfBoletaCampoRMP';
import Spinner from '../Spinner';
import { Download } from 'lucide-react';

interface DownloadPDFProps {
  boleta: BoletaInfoAll;
  buttonLabel?: string;
  buttonClassName?: string;
}

// Componente simplificado para descargar la boleta como PDF
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