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


## Aplicación desplegada en Azure

La aplicación se encuentra disponible públicamente en Microsoft Azure.

**Aplicación web:**  
https://supplier-screening-api-hjcmapawhxewesh5.westus-01.azurewebsites.net/

**API REST:**  
https://supplier-screening-api-hjcmapawhxewesh5.westus-01.azurewebsites.net/api/suppliers

El frontend React y el backend .NET 8 están alojados en Azure App Service, con conexión a Azure SQL Database.


## Despliegue en Azure

La solución se despliega mediante GitHub Actions, integrando React y ASP.NET Core 8 en un mismo Azure App Service.

**Requisitos:**
- Azure App Service con runtime .NET 8.
- Azure SQL Database.
- Credenciales de Azure configuradas en GitHub Actions.

**Proceso de despliegue:**

1. Configurar el App Service y la base de datos en Azure.
2. Configurar las variables de entorno del backend: `ConnectionStrings__DefaultConnection`, `Screening__ApiBaseUrl` y `Screening__ApiKey`.
3. Configurar la autenticación de GitHub Actions con Azure.
4. Ejecutar el workflow `.github/workflows/main_supplier-screening-api.yml`.
5. El workflow compila React y .NET 8, integra ambos componentes y publica la aplicación en Azure App Service.
6. Verificar el funcionamiento desde la URL pública.

El despliegue se ejecuta automáticamente al realizar cambios en la rama `main`.

## Base de datos

Los recursos necesarios para crear e inicializar la base de datos se encuentran en:

- **Scripts SQL:** `database/01_create_and_seed.sql`
- **Migraciones:** `backend/SupplierScreening.Api/Migrations/`
