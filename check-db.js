// Script mínimo para comprobar variables .env y conexión a Postgres
require('dotenv').config();
const { Client } = require('pg');

const required = ['DB_USER','DB_PASSWORD','DB_HOST','DB_PORT','DB_DATABASE'];
const missing = required.filter(k => !process.env[k]);
if (missing.length) {
  console.error('Faltan variables en .env:', missing.join(', '));
  process.exit(2);
}

const client = new Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT) || 5432,
});

(async () => {
  try {
    await client.connect();
    await client.query('SELECT 1');
    console.log('Conexión a Postgres OK (usando .env).');
    await client.end();
    process.exit(0);
  } catch (err) {
    console.error('Error conectando a Postgres:', err.message);
    process.exit(1);
  }
})();
