# Quejas Entidades Boyacá

Sistema web para la gestión y reporte de quejas dirigidas a entidades públicas del departamento de Boyacá.

---

## Tech Stack

- **Node.js**: Backend en JavaScript.
- **Express**: Framework para APIs y rutas.
- **Sequelize**: ORM para PostgreSQL.
- **PostgreSQL**: Base de datos relacional.
- **Supabase**: Hosting de base de datos (opcional).
- **Pug**: Motor de plantillas para vistas.
- **Bootstrap 5**: Estilos y componentes responsivos.
- **Google reCAPTCHA**: Protección contra spam.
- **Jest & Supertest**: Pruebas unitarias y de integración.
- **Docker**: Entorno de base de datos local.

---

## Instalación y ejecución local

### 1. Clona el repositorio

```bash
git clone https://github.com/tu-usuario/quejas-entidades-boy.git
cd quejas-entidades-boy
```

### 2. Instala dependencias

```bash
npm install
```

### 3. Configura las variables de entorno

Copia el archivo `.env` de ejemplo y edítalo si es necesario:

```properties
DATABASE_URL=postgres://user_dev:user_dev_password@localhost:5432/quejas_db_dev
NODE_ENV=development
DB_USER=user_dev
DB_PASSWORD=user_dev_password
DB_NAME=quejas_db_dev
DB_HOST=localhost
DB_PORT=5432
EMAIL_USER=nombreempresa@email.com
EMAIL_PASS=password
EMAIL_TO=nameusuario@email.com
ADMIN_PASS=adminPassword
```

### 4. Levanta la base de datos local con Docker

Asegúrate de tener Docker instalado. Ejecuta:

```bash
docker-compose up -d
```

Esto creará un contenedor PostgreSQL accesible en `localhost:5432`.

### 5. Inicializa la base de datos

Ejecuta las migraciones y los seeds para crear las tablas y datos iniciales:

```bash
npm run db:migrate
npm run db:seed
```

Si necesitas resetear la base de datos:

```bash
npm run db:reset
```

### 6. Inicia el servidor

```bash
npm start
```

El servidor estará disponible en [http://localhost:3000](http://localhost:3000).

---

## Scripts útiles

- `npm run dev` — Ejecuta el servidor en modo desarrollo con reinicio automático (nodemon).
- `npm test` — Ejecuta los tests con Jest.
- `npm run lint` — Ejecuta ESLint para revisar el código.
- `npm run lint:fix` — Corrige automáticamente errores de linting.
- `npm run db:migrate` — Ejecuta migraciones de la base de datos.
- `npm run db:seed` — Inserta datos de ejemplo en la base de datos.
- `npm run db:reset` — Elimina y recrea la base de datos (útil para desarrollo).

---

## Estructura de Carpetas

- `/routes` — Rutas y controladores Express.
- `/services` — Lógica de negocio y acceso a datos con Sequelize.
- `/models` — Definición de modelos ORM.
- `/config` — Configuración de base de datos, caché y entorno.
- `/views` — Vistas Pug.
- `/public` — Archivos estáticos (CSS, JS, imágenes).
- `/test-jest` — Pruebas unitarias y de integración.

---

## Endpoints principales

- **GET /registrar**  
  Renderiza el formulario para registrar una nueva queja.

- **POST /api/quejas**  
  Crea una nueva queja.  
  Parámetros:  
    - `texto`: Texto de la queja (10-2000 caracteres)
    - `id_entidad`: ID de la entidad seleccionada

- **GET /api/quejas?entidadId=ID&page=1&limit=10**  
  Devuelve la lista paginada de quejas asociadas a una entidad.

- **GET /api/quejas/quejas-por-entidad**  
  Devuelve el reporte de número de quejas agrupadas por entidad.

---

## Pruebas

Para ejecutar las pruebas unitarias y de integración:

```bash
npm test
```

---

## Contribuir

1. Haz un fork del repositorio.
2. Crea una rama para tu feature o fix.
3. Haz tus cambios y crea un pull request.

---

## Licencia

MIT

---

**Contacto:**  
Para dudas o sugerencias, abre un issue o contacta a través de los canales habituales.

