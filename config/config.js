require('dotenv').config();

module.exports = {
  // Configuración para tu entorno local con Docker
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
  },
  // Configuración para el entorno de pruebas (usado por CI/GitHub Actions)
  test: {
    use_env_variable: 'DATABASE_URL', // Le dice a Sequelize-CLI que use la URL del entorno de CI
    dialect: 'postgres',
  },
  production: {
    use_env_variable: 'DATABASE_URL',
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  },
};
