# Quejas Entidades Boyacá

Sistema web para la gestión y reporte de quejas dirigidas a entidades públicas del departamento de Boyacá.

## Tech Stack

- **Node.js ^18.x**: Plataforma de ejecución para el backend.
- **Express**: Framework para la creación de APIs y manejo de rutas.
- **PostgreSQL 15.x **: Base de datos relacional para almacenar entidades y quejas.
- **Supabase**: Servicio de hosting para la base de datos PostgreSQL.
- **Pug**: Motor de plantillas para renderizar vistas en el servidor.
- **Bootstrap 5**: Framework CSS para estilos y componentes responsivos.
- **Google reCAPTCHA**: Protección contra spam en formularios.
- **JavaScript (ES6+)**: Lógica del frontend y scripts dinámicos.

## Instalación

1. Clona el repositorio:
   ```bash
   git clone https://github.com/tu-usuario/quejas-entidades-boy.git
   cd quejas-entidades-boy
   ```

2. Instala dependencias:
   ```bash
   npm install
   ```

3. Configura las variables de entorno en `.env`:
   ```
   DATABASE_URL=postgresql://usuario:contraseña@host:puerto/base_de_datos
   ```

4. Inicia el servidor:
   ```bash
   npm start
   ```

## Uso

- Accede a la página principal para consultar y registrar quejas.
- Selecciona una entidad pública para ver las quejas asociadas.
- Usa el reporte para visualizar estadísticas de quejas por entidad.

## Estructura de Carpetas

- `/routes` — Rutas de Express.
- `/services` — Lógica de negocio y acceso a datos.
- `/models` — Conexión y caché de base de datos.
- `/views` — Vistas Pug.
- `/public` — Archivos estáticos (CSS, JS, imágenes).

