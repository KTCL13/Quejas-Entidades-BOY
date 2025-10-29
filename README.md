# Quejas Entidades Boyacá

Sistema web para la gestión y reporte de quejas dirigidas a entidades públicas del departamento de Boyacá.

## Tech Stack

- **Node.js**: Backend en JavaScript
- **Express**: Framework para APIs y rutas
- **Sequelize**: ORM para PostgreSQL
- **PostgreSQL**: Base de datos relacional
- **Pug**: Motor de plantillas para vistas
- **Bootstrap 5**: Estilos y componentes responsivos
- **SendGrid**: Servicio de envío de emails
- **Google reCAPTCHA**: Protección contra spam
- **Jest & Supertest**: Pruebas unitarias y de integración
- **Docker**: Entorno de base de datos local
- **ESLint & Prettier**: Formateo y linting de código

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

Crea un archivo `.env` con las siguientes variables:

```properties
# Database
DATABASE_URL=postgres://user_dev:user_dev_password@localhost:5432/quejas_db_dev
DB_USER=user_dev
DB_PASSWORD=user_dev_password
DB_NAME=quejas_db_dev
DB_HOST=localhost
DB_PORT=5432

# Environment
NODE_ENV=development
API_BASE_URL=http://localhost:3000

# Authentication
AUTH_SERVICE_URL=http://localhost:4000/api/auth

# Email (SendGrid)
EMAIL_USER=apikey
EMAIL_FROM=your_verified_sender@domain.com
EMAIL_PASS=your_sendgrid_api_key
EMAIL_TO=notifications_recipient@domain.com
EMAIL_HOST=SendGrid
SENDGRID_API_KEY=your_sendgrid_api_key

# Security
RECAPTCHA_SECRET_KEY=your_recaptcha_secret_key
```

### 4. Base de datos con Docker

```bash
# Iniciar la base de datos
npm run db:setup

# Si necesitas resetear la base de datos
npm run db:reset
```

### 5. Desarrollo local

```bash
# Modo desarrollo con hot-reload
npm run dev

# Modo producción
npm start
```

## Scripts disponibles

- `npm start` - Inicia el servidor
- `npm run dev` - Inicia el servidor con nodemon
- `npm test` - Ejecuta tests con Jest
- `npm run lint` - Verifica el código con ESLint
- `npm run lint:fix` - Corrige errores de linting
- `npm run prettier` - Formatea el código
- `npm run db:setup` - Configura la base de datos
- `npm run db:reset` - Recrea la base de datos
- `npm run db:migrate` - Ejecuta migraciones
- `npm run db:seed` - Inserta datos iniciales

## Estructura del proyecto

```
├── bin/              # Scripts de inicio
├── config/          # Configuraciones
├── controllers/     # Controladores
├── models/         # Modelos Sequelize
├── public/         # Archivos estáticos
├── routes/         # Rutas Express
│   ├── authRoutes.js
│   ├── comments.js
│   ├── complaints.js
│   ├── complaintsList.js
│   └── reportes.js
├── services/       # Lógica de negocio
├── test-jest/     # Tests
│   ├── integration/
│   └── unit/
└── views/         # Plantillas Pug
```

## API Endpoints

### Quejas

- `GET /api/complaints` - Lista de quejas paginada
- `POST /api/complaints` - Crear nueva queja
- `PUT /api/complaints/change-state/:id` - Cambiar estado
- `GET /api/complaints/quejas-por-entidad` - Reporte de quejas

### Comentarios

- `POST /api/comments/complaint/:id` - Agregar comentario
- `GET /api/comments/complaint/:id` - Obtener comentarios

### Autenticación

- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/logout` - Cerrar sesión

## Pruebas

```bash
# Ejecutar todos los tests
npm test

# Ejecutar tests específicos
npm test -- test-jest/integration/comments.test.js
```

## Licencia

MIT

## Contacto

Para dudas o sugerencias, abre un issue en el repositorio.
