# Sistema de gestión de transporte

Sistema completo de gestión operativa: personas, grupos con subgrupos y jefe de línea, móviles con socio/chofer titular, rotación diaria, programación diaria con historial, e importación masiva desde Excel.

## Stack

Next.js 14 (TypeScript) + PostgreSQL + Prisma 5.20.0 + Auth.js (NextAuth), pensado para desplegarse en Vercel con la base de datos en Neon o Railway.

Las versiones de todas las dependencias quedaron **fijas** (sin `^`) en `package.json` a propósito, para que `npm install` no las actualice solo a versiones más nuevas que puedan romper el proyecto.

## Guía de instalación paso a paso (desde cero)

### 1. Instalar Node.js
Entrá a [nodejs.org](https://nodejs.org), descargá la versión **LTS** e instalala. Confirmá que quedó instalada abriendo una terminal y escribiendo:
```
node -v
```

### 2. Instalar un editor de código
Descargá [Visual Studio Code](https://code.visualstudio.com) (gratis). Vas a usar su terminal integrada (menú **Terminal → New Terminal**).

### 3. Abrir el proyecto
Descomprimí `transporte-app.zip` en una carpeta de tu computadora. En VS Code: **Archivo → Abrir carpeta** y seleccioná esa carpeta.

### 4. Crear una base de datos gratuita
Entrá a [neon.tech](https://neon.tech), creá una cuenta y un proyecto nuevo. Copiá la **connection string** completa (empieza con `postgresql://`).

### 5. Configurar el archivo `.env`
Copiá `.env.example`, renombrá la copia a `.env`, y completá:
- `DATABASE_URL`: pegá ahí la connection string de Neon (reemplazá todo el valor de ejemplo)
- `NEXTAUTH_SECRET`: cualquier texto largo y aleatorio (20+ caracteres)

### 6. Instalar las dependencias
En la terminal, dentro de la carpeta del proyecto:
```
npm install
```
**Importante: no corras `npm audit fix --force` en este proyecto.** Ese comando actualiza paquetes a versiones más nuevas —incluso versiones "release candidate" que rompen todo— para intentar resolver avisos de seguridad que no son urgentes para un proyecto que corrés en tu computadora.

### 7. Generar el cliente de Prisma
```
npm run prisma:generate
```
(Usá siempre `npm run prisma:generate`, nunca `npx prisma generate` directo — `npx` puede llegar a descargar una versión distinta de Prisma a la que instalamos en el proyecto.)

### 8. Crear las tablas y cargar datos de prueba
```
npm run prisma:migrate
npm run seed
```
El seed crea un usuario de prueba: `admin@empresa.com` / `admin123`.

### 9. Levantar el proyecto
```
npm run dev
```
Abrí `http://localhost:3000` e iniciá sesión con el usuario de prueba.

## Solución de problemas conocidos

**"Cannot find module '@prisma/client/runtime/library.js'"** → el cliente de Prisma no se generó. Corré `npm run prisma:generate` (no `npx prisma generate`).

**"No command registered for `generate`" / menciona "@prisma/composer" o "skills sync"** → esto pasa si terminaste con Prisma 7/8 instalado en vez de la versión 5.20.0 fijada (normalmente por haber corrido `npm audit fix --force`). Solución:
1. Borrá `node_modules` y `package-lock.json`
2. Corré `npm install` de nuevo (con este `package.json` ya no debería pasar, porque las versiones quedaron fijas)
3. `npm run prisma:generate`

**El proyecto está en una carpeta sincronizada con OneDrive/Google Drive** → puede romper la instalación de `node_modules` a mitad de camino. Si tenés errores raros e intermitentes, movés la carpeta del proyecto a una ruta no sincronizada (ej. `C:\proyectos\transporte-app`) y repetís desde el paso 6.

## ⚠️ Si ya tenías el proyecto corriendo con datos de prueba

El modelo de datos cambió de forma importante (ver "Estructura real del negocio" abajo): la tabla `Socio` pasó a llamarse `Persona`, y se agregaron `Subgrupo`, `JefeGrupoHistorial`, `MovilChoferHistorial`, `ReemplazoDiario`, `RotacionDiaria` y `ProgramacionDiaria` en reemplazo de la `AsignacionDiaria` simple que había antes. No hay forma de migrar datos de prueba viejos a esta nueva estructura, así que hay que reiniciar la base:

```
npm run prisma:generate
npx prisma migrate reset
npm run seed
```

`migrate reset` va a preguntar confirmación y borra todo lo que hubiera en la base — está bien para una base de desarrollo/pruebas, nunca lo corras contra datos reales de producción sin backup.

## Estructura real del negocio

- Cada **Grupo** (numerado 1, 2, 3...) se divide en **Subgrupo A y B**, creados automáticamente al registrar el grupo.
- Cada **Subgrupo** contiene varios **Móviles** (internos).
- El **jefe de línea** se asigna al Grupo, no a una ubicación, y puede cambiar — el sistema guarda el historial completo de quién fue jefe y en qué fechas (`JefeGrupoHistorial`).
- El **socio** (dueño) y el **chofer titular** de un interno pueden ser personas distintas, y un mismo chofer contratado puede manejar internos de socios distintos.
- Un cambio **definitivo** de chofer titular queda registrado con fecha, motivo y quién lo autorizó (`MovilChoferHistorial`). Un **reemplazo puntual** para un solo día no cambia al titular (`ReemplazoDiario`).
- La **rotación diaria** asigna cada Subgrupo (no el Grupo completo) a una parada — A y B pueden ir a paradas distintas el mismo día (`RotacionDiaria`).
- La **Programación diaria** es una fila por interno por día, generada a partir de todo lo anterior: chofer real de ese día, subgrupo, grupo, jefe de línea y parada. Es un registro inmutable — aunque después cambien el jefe o el titular, esa fila queda igual, así se puede reconstruir exactamente la situación de cualquier fecha pasada.

## Qué incluye el proyecto hasta ahora

- Modelo de datos completo en `prisma/schema.prisma`
- Login por correo/contraseña con roles (`ADMIN`, `JEFE_GRUPO`, `SECRETARIA`, `SOCIO`, `CHOFER`)
- **Panel** (`/dashboard`) con sidebar colapsable (se oculta en pantallas chicas, con botón hamburguesa), tarjetas de conteo que enlazan a cada sección, y **actividad reciente** con eventos reales (altas de personas, cambios de chofer titular, rotaciones, asistencias registradas, programación generada)
- CRUD completo de **Personas** (`/dashboard/personas`), **Móviles** (`/dashboard/moviles`), **Grupos** (`/dashboard/grupos`, con subgrupos e historial de jefe) y **Paradas** (`/dashboard/paradas`) — cada lista tiene buscador, contador y el formulario de alta colapsado detrás de un botón (se abre al hacer clic y se cierra solo al guardar)
- **Rotación diaria** (`/dashboard/rotacion`): asignar cada subgrupo a una parada por fecha
- **Programación diaria** (`/dashboard/programacion`): botón para generar/actualizar la programación de una fecha, y verla en tabla
- **Asistencia diaria** (`/dashboard/asistencia`): por cada fila de la programación del día, marcar "A tiempo / Tardanza / Ausente" con un clic — la tardanza o ausencia aplica automáticamente la multa configurada (`TipoInfraccion`) y el total del día queda visible arriba
- **Reportes** (`/dashboard/reportes`): hub con 8 reportes propuestos; **Asistencia por chofer** ya funciona con datos reales, con filtros por fecha/grupo/estado, tarjetas de resumen, buscador, impresión y exportación a CSV
- **Importar desde Excel** (`/dashboard/importar`): plantilla con hojas Personas, Grupos, Moviles y Paradas para cargar todo de una vez, con normalización de Rol/Estado/fechas para admitir variantes de texto reales, y la columna de interno formateada como texto para no perder ceros a la izquierda

## Próximo: el flujo de dinero de las multas

Todavía no está modelado cómo esas multas se convierten en un registro de ingresos, ni cómo se cargan los gastos operativos (sueldos de secretarias, insumos, etc.) que esos ingresos cubren — eso es a propósito, para definirlo bien antes de construirlo.

## Próximos pasos

- Los 5 reportes restantes del hub (historial de interno, rotación por grupo, ausencias y penalizaciones, historial de jefes, actividad por socio)
- Permisos/vacaciones y encomiendas (ya están en el modelo de datos, falta la pantalla)
- Registro de asistencia manual/GPS/QR si en algún momento hace falta más detalle que lo que ya da la Programación diaria

## Desplegar en Vercel

1. Subir este proyecto a un repositorio Git
2. Importarlo en Vercel
3. Configurar las mismas variables de entorno del paso 5 en el panel de Vercel
4. Conectar la base de datos (Neon o Railway) y correr las migraciones desde ahí (`npx prisma migrate deploy`)
