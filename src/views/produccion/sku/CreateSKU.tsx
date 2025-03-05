import { Button } from "@mui/material";
import { toast } from "react-toastify";
import Error from "@/components/Error";

export default function CreateSKU() {
  return (
    <>
      <h2 className="text-4xl font-bold">Crear SKU</h2>

      <div>
        <form className="mt-10 w-2/3 mx-auto shadow p-10 space-y-5">

          <div className="flex flex-col gap-2">
            <label className="text-lg font-bold uppercase" htmlFor="code">
              Codigo:
            </label>
            <input
              autoComplete="off"
              id="code"
              type="text"
              placeholder="Ingrese el codigo del sku"
              className="border border-black p-3"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-lg font-bold uppercase" htmlFor="name">
              nombre:
            </label>
            <input
              autoComplete="off"
              id="name"
              type="number"
              placeholder="Ingrese el nombre del sku"
              className="border border-black p-3"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-lg font-bold uppercase" htmlFor="unit_mesurment">
              unidad de medida:
            </label>
            <input
              autoComplete="off"
              id="unit_mesurment"
              type="number"
              placeholder="Ingrese la unidad de medida del sku"
              className="border border-black p-3"
            />
          </div>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ marginTop: 2 }}
          >
              <p className="font-bold text-lg">Crear sku</p>
          </Button>
        </form>
      </div>
      
    </>
  )
}
