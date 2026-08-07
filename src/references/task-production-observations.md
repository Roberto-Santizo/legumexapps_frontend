# TaskProductionPlan — campo `observations`

Columna `observations` en `task_production_plans`: `string(255)` nullable.
Texto libre del usuario sobre la tarea. **No confundir con `note`**
(`TaskProductionPlanNote`, tabla aparte, `reason` + `action`, flujo `is_justified`).

## 1. Editar/agregar observación (endpoint dedicado)

`PATCH /api/tasks-production/{id}/observations`
Auth: JWT (`jwt.auth`)
Controller: `TaskProductionController@UpdateTaskProductionObservations`

Body:

```json
{ "observations": "Texto de la observación" }
```

Reglas: `observations` → `nullable|string|max:255`. Mandar `null` la borra.
Mismo endpoint sirve para crear y editar.

Respuestas:

- 200 `{ "statusCode": 200, "message": "Observación actualizada correctamente" }`
- 404 `{ "statusCode": 404, "message": "La tarea no fue encontrada" }`
- 422 validación (>255 chars)
- 500 `{ "statusCode": 500, "message": "<error>" }`

## 2. Crear tarea con observación (endpoint existente, campo nuevo)

`POST /api/tasks-production/new-task/{weekly_plan_id}`

Se agregó `observations` opcional por cada item de `data`:

```json
{
  "data": [
    {
      "line_id": 1,
      "sku_id": 5,
      "total_lbs": 1000,
      "destination": "X",
      "operation_date": "2026-08-10",
      "observations": "Opcional"
    }
  ]
}
```

Si se omite queda `null`. Sin cambios en el resto del contrato.

## 3. Endpoints que ahora devuelven `observations`

Siempre string; vacío `""` cuando es null.

| Endpoint | Resource |
|---|---|
| `GET /api/tasks-production/{id}` | TaskProductionPlanDetailsResource |
| `GET /api/tasks-production/details/{id}` | TaskProductionPlanDetailResource |
| `GET /api/tasks-production/finished/details/{id}` | FinishedTaskProductionResource |
| `GET /api/tasks-production/edit-details/{id}` | TaskProductionEditDetailsResource |
| listado por línea (`WeeklyProductionPlanController`) | TaskProductionPlanByLineResource |

## Nota

`PUT/PATCH /api/tasks-production/{id}` (`update()`) **no** toca `observations`
— intencional, para que el form de edición general no la borre.
