import { Button } from "@mui/material";

export default function FormControlQuality() {

  return (
    <>
    <h2 className="text-4xl font-bold">Control de Calidad Materia Prima </h2>
    <div>
      <form
        className="mt-10 w-2/3 mx-auto shadow p-10 space-y-5"
        noValidate
      >

        <div className="flex flex-col gap-2">
          <label className="text-lg font-bold uppercase" htmlFor="n_boleta">
            No. Boleta:
          </label>
          <input
            autoComplete="off"
            id="n_boleta"
            type="number"
            placeholder={"Numero de Boleta"}
            className="border border-black p-3"
            // {...register("n_boleta", { required: "El numero de boleta es obligatorio" })}
          />
          {/* {errors.n_boleta && <Error>{errors.n_boleta?.message?.toString()}</Error>} */}
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-lg font-bold uppercase" htmlFor="doc_date">
            Fecha:
          </label>
          <input
            autoComplete="off"
            id="doc_date"
            type="date"
            placeholder={"Fecha"}
            className="border border-black p-3"
            // {...register("doc_date", { required: "La fecha es obligatoria" })}
          />
          {/* {errors.doc_date && <Error>{errors.doc_date?.message?.toString()}</Error>} */}
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-lg font-bold uppercase" htmlFor="net_weight">
            Peso Neto:
          </label>
          <input
            autoComplete="off"
            id="net_weight"
            type="date"
            placeholder={"Peso Neto"}
            className="border border-black p-3"
            // {...register("net_weight", { required: "El peso Neto es obligatorio" })}
          />
          {/* {errors.net_weight && <Error>{errors.net_weight?.message?.toString()}</Error>} */}
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-lg font-bold uppercase" htmlFor="no_doc_cosechero">
            No. Hoja Cosechero:
          </label>
          <input
            autoComplete="off"
            id="no_doc_cosechero"
            type="text"
            placeholder={"Fecha"}
            className="border border-black p-3"
            // {...register("no_doc_cosechero", { required: "El No. Hoja Cosechero es obligatorio" })}
          />
          {/* {errors.no_doc_cosechero && <Error>{errors.no_doc_cosechero?.message?.toString()}</Error>} */}
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-lg font-bold uppercase" htmlFor="sample_units">
            Unidades Muestra:
          </label>
          <input
            autoComplete="off"
            id="sample_units"
            type="text"
            placeholder={"Unidades Muestra"}
            className="border border-black p-3"
            // {...register("sample_units", { required: "El numero de unidades Muestra es obligatorio" })}
          />
          {/* {errors.sample_units && <Error>{errors.sample_units?.message?.toString()}</Error>} */}
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-lg font-bold uppercase" htmlFor="total_baskets">
            Cantidad de Canastas:
          </label>
          <input
            autoComplete="off"
            id="total_baskets"
            type="number"
            placeholder={"Total de Canastas"}
            className="border border-black p-3"
            // {...register("total_baskets", { required: "El total de canastas es obligatorio" })}
          />
          {/* {errors.total_baskets && <Error>{errors.total_baskets?.message?.toString()}</Error>} */}
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-lg font-bold uppercase" htmlFor="ph">
            PH:
          </label>
          <input
            autoComplete="off"
            id="ph"
            type="number"
            placeholder={"Ph"}
            className="border border-black p-3"
            // {...register("ph", { required: "El ph es obligatorio" })}
          />
          {/* {errors.ph && <Error>{errors.ph?.message?.toString()}</Error>} */}
        </div>

        
        <div className="flex flex-col gap-2">
          <label className="text-lg font-bold uppercase" htmlFor="percentage">
            % A Pagar:
          </label>
          <input
            autoComplete="off"
            id="percentage"
            type="number"
            placeholder={"Porcentaje a pagar"}
            className="border border-black p-3"
            // {...register("percentage", { required: "El percentage a pagar es obligatorio" })}
          />
          {/* {errors.percentage && <Error>{errors.percentage?.message?.toString()}</Error>} */}
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-lg font-bold uppercase" htmlFor="brix">
            Brix:
          </label>
          <input
            autoComplete="off"
            id="brix"
            type="number"
            placeholder={"Dato del brix"}
            className="border border-black p-3"
            // {...register("brix", { required: "El brix es obligatorio" })}
          />
          {/* {errors.brix && <Error>{errors.brix?.message?.toString()}</Error>} */}
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-lg font-bold uppercase" htmlFor="valid_pounds">
            Libras Pagables:
          </label>
          <input
            autoComplete="off"
            id="valid_pounds"
            type="number"
            placeholder={"Dato del valid_pounds"}
            className="border border-black p-3"
            // {...register("valid_pounds", { required: "El valid_pounds es obligatorio" })}
          />
          {/* {errors.valid_pounds && <Error>{errors.valid_pounds?.message?.toString()}</Error>} */}
        </div>


        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ marginTop: 2 }}
        >
            <p className="font-bold text-lg">Crear boleta de calidad materia prima</p>
        </Button>
      </form>
    </div>
  </>
  )
}
