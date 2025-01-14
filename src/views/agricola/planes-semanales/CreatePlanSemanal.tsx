import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@mui/material";
import ReturnLink from "../../../components/utilities-components/ReturnLink";
import Spinner from "../../../components/Spinner";

export default function CreatePlanSemanal() {
    const [loading, setLoading] = useState(false);
  const onDrop = useCallback((acceptedFiles: File[]) => {
    setLoading(true);
    console.log(acceptedFiles);
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <>
      <h2 className="text-4xl font-bold">Crear Plan Semanal</h2>
      <ReturnLink url="/planes-semanales" />

      <form className="w-1/2 mx-auto">
        <div
          {...getRootProps()}
          style={{
            border: "2px dashed #cccccc",
            borderRadius: "10px",
            padding: "20px",
            textAlign: "center",
            backgroundColor: isDragActive ? "#e3f2fd" : "#f9f9f9", // Cambia el fondo al arrastrar
          }}
        >
          <input {...getInputProps()} disabled={loading}/>
          {loading && <Spinner />}
          {(isDragActive) ? (
            <p>Suelta el archivo aquí</p>
          ) : (
            <p className="uppercase font-medium">Arrasta el archivo acá o selecciona</p>
          )}
        </div>

        <Button
          //   disabled={loadingUser}
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ marginTop: 2 }}
        >
          {/* {loadingUser ? ( */}
          {/* <Spinner /> */}
          {/* ) : ( */}
          <p className="font-bold text-lg">Crear Plan Semanal</p>
          {/* )} */}
        </Button>
      </form>
    </>
  );
}
