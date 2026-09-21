# Supplier Screening SPA

Aplicación web para gestión y debida diligencia de proveedores con verificación automática contra listas OFAC.

## Características

- ✅ **CRUD completo** de proveedores con validación
- ✅ **Búsqueda universal** por cualquier campo (nombre, país, email, teléfono, dirección)
- ✅ **Screening OFAC** automático contra listas de sanciones
- ✅ **Interfaz moderna** con Material UI y tablas responsivas
- ✅ **10 campos obligatorios** por proveedor incluyendo facturación anual

## Tecnologías

**Backend:**
- .NET 8 Web API
- Entity Framework Core
- SQL Server / Azure SQL Database
- Swagger/OpenAPI

**Frontend:**
- React 18 + TypeScript
- Material UI (MUI)
- Vite
- Axios

## Estructura del proyecto

```
├── backend/            # API .NET 8
├── frontend/           # SPA React + MUI  
└── database/           # Scripts SQL
```

## Desarrollo local

**1. Base de datos:**
```bash
cd backend/SupplierScreening.Api
dotnet user-secrets set "ConnectionStrings:DefaultConnection" "<tu-cadena-conexion>"
dotnet user-secrets set "Screening:ApiKey" "<api-key-ofac>"
dotnet ef database update
```

**2. Backend (puerto 5080):**
```bash
dotnet run --project SupplierScreening.Api
```

**3. Frontend (puerto 5173):**
```bash
cd frontend
npm install
npm run dev
```

Acceder a http://localhost:5173

## Funcionalidades principales

- **Gestión de proveedores**: Crear, editar, ver, eliminar con validación completa
- **Búsqueda inteligente**: Filtra por cualquier campo en tiempo real  
- **Screening OFAC**: Verificación contra múltiples fuentes de sanciones
- **Datos completos**: RUC, razón social, país, facturación, contacto, etc.
- **Interfaz responsiva**: Optimizada para escritorio y móvil