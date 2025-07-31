import {
  HomeIcon,
  UserCog,
  User,
  UserCheck,
  BookCheck,
  BookXIcon,
  ListCheck,
  Map,
  Warehouse,
  FileSpreadsheet,
  Truck,
  Users,
  AlarmClockPlus,
  BookOpenCheck,
  ChartBarIncreasing,
  ChartLine,
  ChartNoAxesCombined,
  FileUser, Box, ClipboardPaste,
  ChartPie,
  Apple
} from "lucide-react";
import { usePermissions } from "@/hooks/usePermissions";
import NavLinkComponent from "./utilities-components/NavLinkComponent";

export default function Navegation() {
  const { hasPermission } = usePermissions();
  return (
    <div className="space-y-1.5">
      <NavLinkComponent url="/dashboard" text="Dashboard">
        <HomeIcon />
      </NavLinkComponent>

      {hasPermission("admin") && (
        <>
          <NavLinkComponent url="/usuarios" text="Usuarios">
            <User />
          </NavLinkComponent>

          <NavLinkComponent url="/roles" text="Roles">
            <UserCog />
          </NavLinkComponent>

          <NavLinkComponent url="/permisos" text="Permisos">
            <UserCheck />
          </NavLinkComponent>
        </>
      )}

      {hasPermission("see plan semanal finca") && (
        <NavLinkComponent url="/planes-semanales" text="Planes Semanales Finca">
          <BookCheck />
        </NavLinkComponent>
      )}

      {hasPermission("administrate fincas") && (
        <>
          <NavLinkComponent url="/tareas" text="Tareas Generales">
            <ListCheck />
          </NavLinkComponent>

          <NavLinkComponent url="/lotes" text="Lotes">
            <Map />
          </NavLinkComponent>

          <NavLinkComponent url="/cdps" text="Control Plantación">
            <BookXIcon />
          </NavLinkComponent>

          <NavLinkComponent url="/insumos" text="Insumos">
            <Warehouse />
          </NavLinkComponent>
        </>
      )}

      {hasPermission("see boleta rmp") && (
        <NavLinkComponent url="/rmp" text="Boleta Materia Prima">
          <FileSpreadsheet />
        </NavLinkComponent>
      )}

      {hasPermission("see boleta transport") && (
        <NavLinkComponent
          url="/transporte-boleta"
          text="Inspección de Transporte"
        >
          <Truck />
        </NavLinkComponent>
      )}

      {hasPermission("administrate products") && (
        <NavLinkComponent url="/productos" text="Productos y Variedades">
          <ChartBarIncreasing />
        </NavLinkComponent>
      )}

      {hasPermission("create producers") && (
        <NavLinkComponent url="/productores" text="Productores">
          <User />
        </NavLinkComponent>
      )}

      {hasPermission("create carriers") && (
        <NavLinkComponent url="/transportistas" text="Transportistas y Pilotos">
          <Users />
        </NavLinkComponent>
      )}

      {hasPermission("see plans production") && (
        <NavLinkComponent
          url="/planes-produccion"
          text="Plan Semanal Producción"
        >
          <BookOpenCheck />
        </NavLinkComponent>
      )}

      {hasPermission('see draft planification') && (
        <NavLinkComponent url="/planificador-produccion" text="Planificador Producción">
          <ChartPie />
        </NavLinkComponent>
      )}

      {hasPermission("administrate production performances") && (
        <>
          <NavLinkComponent url="/lineas-skus" text="Lineas & SKUS">
            <ChartLine />
          </NavLinkComponent>

          <NavLinkComponent url="/skus" text="Sku's">
            <ChartBarIncreasing />
          </NavLinkComponent>

          <NavLinkComponent url="/lineas" text="Lineas">
            <Users />
          </NavLinkComponent>

          <NavLinkComponent url="/tiempos-muertos" text="Tiempos Muertos">
            <AlarmClockPlus />
          </NavLinkComponent>
        </>
      )}

      {hasPermission("see daily production graphics") && (
        <NavLinkComponent url="/graficas-diarias" text="Gráficas Diarias">
          <ChartNoAxesCombined />
        </NavLinkComponent>
      )}

      {hasPermission('create mp transactions') && (
        <>
          <NavLinkComponent url="/material-empaque" text="Items Material Empaque">
            <Box />
          </NavLinkComponent>

          <NavLinkComponent url="/material-empaque-transacciones" text="Transacciones Material Empaque">
            <ClipboardPaste />
          </NavLinkComponent>
        </>
      )}

      {hasPermission("permission employee") && (
        <NavLinkComponent url="/permisos-empleados" text="Permisos Empleados">
          <FileUser />
        </NavLinkComponent>
      )}

      {hasPermission('see raw material items') && (
        <NavLinkComponent url="/materia-prima" text="Materia Prima">
          <Apple />
        </NavLinkComponent>
      )}
    </div>
  );
}
