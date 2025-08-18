// Cargar variables de entorno antes de crear el pool
require('dotenv').config();

const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_DATABASE || 'Quejas', // usa exactamente el valor de .env (ej. "Quejas")
  password: process.env.DB_PASSWORD || '',
  port: Number(process.env.DB_PORT) || 5432,
  // opcional: max, idleTimeoutMillis, connectionTimeoutMillis
});

module.exports = { pool };