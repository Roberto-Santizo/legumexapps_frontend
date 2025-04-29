import LogoLegumex from "../logos/LogoLegumex";

export default function IngresoInsumos() {
  return (
    <>
      <div>
        <div>
          <div>
            <LogoLegumex />
          </div>
          <div>
            <h1 className="font-bold">Ingreso a bodega - insumos</h1>
          </div>
          <div>
            <p className="font-bold uppercase">R-ro-bod-01</p>
            <p className="font-bold text-red-500">
              No: <span>008562</span>{" "}
            </p>
          </div>
        </div>
        <div className="uppercase font-bold w-1/2 ">
          <p className="upp">Agroindustria legumex, S.A.</p>
          <p>12 avenida 6-15 zona 2 sector </p>
          <p>las majadas, el Tejar, Chimaltenango</p>
          <p>PBX: 7824 9300</p>
        </div>
        <div>
            <div>
                <p className="font-bold">Fecha: de ingreso a bodega: <span className="font-normal">Insertar dato acá</span></p>
                <p className="font-bold">Proveedor: <span className="font-normal">Insertar dato acá</span></p>
            </div>
            <div>
                <p></p>
            </div>
        </div>
      </div>
    </>
  );
}
