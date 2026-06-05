# Desafio Tecnico

Aplicacion full stack para gestion de tareas con:

- Backend: Node.js + TypeScript + Express + SQLite
- Frontend: React + TypeScript + Vite
- Contenerizacion: Docker + Docker Compose

## Funcionalidades

### Backend

- CRUD completo de tareas
  - Crear tarea
  - Listar tareas con filtros
  - Obtener tarea por ID
  - Actualizar tarea
  - Eliminar tarea
- Endpoint de compatibilidad para marcar completada (`PATCH /tasks/:id/complete`)
- Filtros por estado (`completed=true|false`) y busqueda (`search=texto`)
- Manejo centralizado de errores con respuestas consistentes

### Frontend

- Listar tareas
- Crear tareas
- Marcar tareas como completadas
- Filtrar por estado
- Buscar por titulo
- Eliminar Tarea

## Estructura

- backend
- frontend
- docker-compose.yml

### Backend (hexagonal + clean architecture)

- src/domain
  - entities: modelos de dominio
  - ports: contratos de entrada/salida
- src/app
  - use-cases: logica de negocio orquestada
- src/infra
  - persistence/sqlite: adaptador de persistencia
  - persistence/sqlite/task.queries.ts: SQL separado de la logica de negocio
- src/adapters
  - controllers: adaptador de entrada REST
  - routes: rutas Express
  - mappers: mapeo de request a filtros de dominio
  - middlewares/error-handler.middleware.ts: manejo centralizado de errores
- src/config
  - container: composicion e inyeccion de dependencias
- src/shared
  - errors: errores de aplicacion reutilizables

## Scripts utiles

### Backend

- `npm run dev`: levanta servidor en desarrollo
- `npm run build`: compila TypeScript a `dist/`
- `npm start`: ejecuta codigo compilado
- `npm test`: ejecuta tests unitarios e integracion

### Frontend

- `npm run dev`: levanta frontend con Vite
- `npm run build`: genera build estatico en `dist/`

## Ejecutar en local (sin Docker)

### Backend

1. Ir a backend
2. Instalar dependencias
3. Levantar servidor

Comandos:

npm install
npm run dev

Servidor en:

http://localhost:4000

### Frontend

1. Ir a frontend
2. Instalar dependencias
3. Levantar app

Comandos:

npm install
npm run dev

App en:

http://localhost:5173

## Ejecutar con Docker

Desde la raiz del proyecto:

docker compose up --build

Servicios:

- Frontend: http://localhost:5173
- Backend: http://localhost:4000

## Endpoints backend

- GET /health
- GET /tasks
- GET /tasks/:id
- POST /tasks
  - body JSON: { "title": "Mi tarea" }
- PUT /tasks/:id
  - body JSON: { "title": "Nuevo titulo", "completed": true }
- DELETE /tasks/:id
- PATCH /tasks/:id/complete

## Formato de errores

Errores esperados retornan JSON consistente:

```json
{
  "type": "DOMAIN_ERROR",
  "message": "task not found"
}
```

`type` puede ser `DOMAIN_ERROR` o `INFRASTRUCTURE_ERROR`.

## Persistencia

- DB por defecto: `backend/data/tasks.db`
- En tests de integracion se usa `DB_PATH=:memory:` para aislamiento

## Notas de arquitectura

- Tipado estricto en TypeScript
- Backend desacoplado con puertos y adaptadores (arquitectura hexagonal)
- Casos de uso aislados en capa application
- Adaptador SQLite encapsulado en infrastructure
- SQL separado en modulo propio (`task.queries.ts`)
- Controllers delgados sin logica de negocio
- Tests unitarios de use cases y tests de integracion HTTP
- Persistencia local en SQLite en backend/data/tasks.db
