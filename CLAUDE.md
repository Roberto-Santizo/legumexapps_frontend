# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Comandos

```bash
npm run dev      # Vite dev server
npm run build    # tsc -b && vite build  (el typecheck falla el build)
npm run lint     # ESLint
npm run preview  # preview del build
```

No hay suite de tests ni runner configurado. Para verificar cambios: `npm run build` (typecheck estricto) + `npm run lint`.

## Contexto

SPA React 18 + TS + Vite para LegumexApps (ERP agro-industrial: agrícola, calidad, producción, bodega, RRHH). Consume una API Laravel (`VITE_BASE_URL`) con auth por Sanctum-style bearer token. UI y dominio en español.

Variables de entorno (`.env`, no versionado): `VITE_BASE_URL`, `VITE_AWS_BUCKET_URL`, `VITE_PUSHER_APP_*` / `VITE_REVERB_*` (websockets Laravel Echo).

Deploy en Vercel (`vercel.json` reescribe todo a `/` para el router SPA).

## Arquitectura

### Routing y autorización

`main.tsx` → `router.tsx` compone 7 módulos de rutas por área de negocio (`src/routes/*.tsx`): Public, Admin, Agricola, Calidad, Produccion, Recursos, Bodega.

Cada módulo (excepto Public) sigue el mismo patrón: un array `routes` de `{ path, component: lazy(...), roles: string[] }` mapeado dentro de `<Route element={<Layout />}>` con `<Suspense fallback={<Spinner/>}>` + `<ProtectedRoutes roles={...}>`. **Al agregar una vista, agrégala a ese array con sus roles** — no hay rutas declaradas fuera de él.

Dos mecanismos de autorización, independientes:

- **Roles** (`useRole` → `getUserRoleByToken`): gatean rutas vía `ProtectedRoutes`. Un solo rol por usuario; si no coincide, toast de error + redirect a `/dashboard`. Roles en uso: `admin`, `adminagricola`, `adminbodega`, `admincalidad`, `adminprod`, `agricola`, `alameda`, `audiproceso`, `auxbodega`, `auxcalidad`, `auxrrhh`, `costosuser`, `exportuser`, `gerencia`, `linda`, `logistics`, `pcalidad`, `pcampo`, `pcostos`, `pprod`, `tehuya` (`alameda`/`linda`/`tehuya` son fincas).
- **Permisos** (`usePermissions().hasPermission('...')`): gatean UI dentro de las vistas y los links del sidebar (`src/components/Navegation.tsx`). Strings en inglés estilo `'edit rmp doc'`, `'see boleta rmp'`.

`Layout.tsx` corre `useAuth()` (query `authenticate`, refetch cada 5 min + al volver a la pestaña); ante error borra `AUTH_TOKEN` de localStorage y manda a `/login`.

### Capa de datos

TanStack Query es la única capa de estado de servidor; no hay caché en Zustand. Axios centralizado en `src/config/axios.ts` inyecta `Authorization: Bearer <localStorage AUTH_TOKEN>`.

Convención de función API (seguirla en código nuevo):

```ts
export async function getX(params) {
  try {
    const { data } = await clienteAxios(url);
    const result = XSchema.safeParse(data);      // validación zod de la respuesta
    if (result.success) return result.data.response;
    throw new Error('Información no válida');
  } catch (error) {
    if (isAxiosError(error)) throw new Error(error.response?.data.message);
    throw new Error('Error no controlado');
  }
}
```

Las respuestas del backend se envuelven: `ApiResponseSchema` (`{ statusCode, message? }`) se extiende con `.extend({ response: ... })`, y las listas paginadas usan `{ data: [...], meta: paginatedSchema }` (`src/schemas/httpRequestsSchemas.ts`, `src/utils/schemas.ts`).

Websockets: `src/lib/echo.ts` inicializa Echo/Pusher a nivel de módulo y expone hooks (`usePlanificationWebSocket`) que invalidan query keys al recibir eventos.

### Estado de cliente

Zustand con patrón de slices: `src/store.ts` combina `src/stores/*Slice.ts` en `useAppStore`. Solo estado de UI (sidebar) y filtros compartidos de planificación.

### Notificaciones

Nunca importar `toast` directamente en vistas. Usar `useNotification()` de `@/core/notifications/NotificationContext`, que devuelve un `INotificationAdapter` (`success`/`error`). El adapter concreto se inyecta en `main.tsx` (`ReactHotToastAdapter`; existe también `ReactTostifyAdapter`).

### Organización del código — dos convenciones coexistentes

El repo está migrando de una estructura por capas a módulos por feature:

- **Legacy**: API en `src/api/XAPI.ts`, tipos en `src/types/`, schemas zod en `src/utils/`, vistas planas en `src/views/<area>/<feature>/Index.tsx`.
- **Actual (preferida para código nuevo)**: módulo autocontenido `src/views/<area>/<feature>/{api,schemas,types,components,views}/` — ver `src/views/agricola/cdps/` o `src/views/admin/permisos/` como referencia.

Al tocar un feature legacy, no lo migres salvo que se pida; sigue el patrón local del archivo.

### Vistas

Patrón típico: `useForm` (react-hook-form, tipo `DraftX`) + `useMutation`, con `onError`/`onSuccess` llamando a `notify` y `navigate`. El botón de submit se deshabilita con `isPending` y muestra `<Spinner />`. Los formularios se extraen a `components/Form.tsx` recibiendo `{ register, errors }`.

Componentes compartidos: `src/components/form/` (inputs con react-hook-form + react-select), `src/components/shared/` (Table, Pagination, Title, CardInfo), `src/components/utilities-components/` (Spinner, ShowErrorAPI, LoadingOverlay), `src/components/ui/` (shadcn/ui, style new-york, baseColor stone, iconos lucide).

## Convenciones

- Alias: `@/` → `src/`, `#/` → `public/`. Los paths de `tsconfig.app.json` están enumerados uno por uno; **al crear un directorio nuevo de primer nivel bajo `src/`, hay que agregar su path ahí** o el build (`tsc -b`) falla aunque Vite resuelva.
- `strict: true` + `noUnusedLocals` + `noUnusedParameters`: cualquier import o variable sin usar rompe el build. ESLint además tiene `unused-imports/no-unused-imports` como error.
- Nombres de dominio, textos de UI y mensajes de error en español; nombres de permisos en inglés.
- Estilos con Tailwind; clases utilitarias propias como `button` viven en `src/index.css`.
