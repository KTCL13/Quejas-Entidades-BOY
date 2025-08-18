// Cargar .env antes de cualquier otro módulo que use las variables
require('dotenv').config();

const { pool } = require('../models/db');

// Cargar todas las entidades
const loadEntidades = async () => {
  try {
    const res = await pool.query('SELECT * FROM entidades ORDER BY id');
    return res.rows;
  } catch (err) {
    console.error('Error cargando entidades:', err);
    throw err;
  }
};

// Obtener quejas paginadas por entidad
const getQuejasPaginadasForEntity = async (entidadId, page = 1, limit = 10) => {
  // validaciones básicas de tipos
  const id = Number(entidadId);
  const p = Math.max(1, parseInt(page, 10) || 1);
  const l = Math.max(1, parseInt(limit, 10) || 10);
  if (!Number.isInteger(id) || id <= 0) {
    throw new Error('ID de entidad inválido');
  }

  const offset = (p - 1) * l;
  try {
    const res = await pool.query(
      `SELECT * 
       FROM quejas 
       WHERE entidad_id = $1 
       ORDER BY id DESC 
       LIMIT $2 OFFSET $3`,
      [id, l, offset]
    );
    return res.rows;
  } catch (err) {
    console.error('Error obteniendo quejas paginadas:', err);
    throw err;
  }
};

// Reporte: número de quejas por entidad
const getReporteQuejasPorEntidad = async () => {
  try {
    const res = await pool.query(`
      SELECT e.id AS entidad_id, e.nombre_entidad, COUNT(q.id) AS total_quejas
      FROM entidades e
      LEFT JOIN quejas q ON e.id = q.entidad_id
      GROUP BY e.id, e.nombre_entidad
      ORDER BY total_quejas DESC
    `);
    return res.rows;
  } catch (err) {
    console.error('Error generando reporte de quejas por entidad:', err);
    throw err;
  }
};

// Registrar nueva queja
const createQueja = async ({ texto, entidad_id }) => {
  if (!texto || texto.trim().length < 10 || texto.trim().length > 2000) {
    throw new Error('La queja debe tener entre 10 y 2000 caracteres');
  }

  const eid = Number(entidad_id);
  if (!Number.isInteger(eid) || eid <= 0) {
    throw new Error('La entidad especificada no es válida');
  }

  // validar si la entidad existe
  const entidad = await pool.query(
    'SELECT id FROM entidades WHERE id = $1',
    [eid]
  );

  if (entidad.rows.length === 0) {
    throw new Error('La entidad especificada no existe');
  }

  // insertar queja
  const result = await pool.query(
    `INSERT INTO quejas (descripcion_queja, entidad_id, fecha)
     VALUES ($1, $2, NOW())
     RETURNING *`,
    [texto.trim(), eid]
  );

  return result.rows[0];
};

// Nueva función: probar conexión a la DB
const testDbConnection = async () => {
  try {
    const res = await pool.query('SELECT 1 AS ok');
    return res.rows && res.rows[0] && res.rows[0].ok === 1;
  } catch (err) {
    console.error('Fallo prueba de conexión a DB:', err.message || err);
    throw err;
  }
};

module.exports = {
  loadEntidades,
  getQuejasPaginadasForEntity,
  getReporteQuejasPorEntidad,
  createQueja,
  testDbConnection
};
