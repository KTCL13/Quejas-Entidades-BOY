import sql from '../models/db.js';
import { setEntidadesCache } from '../models/cache.js';

export const getQuejasPaginadasForEntity = async (entidadId, page = 1, limit = 10) => {
  try {
    const offset = (page - 1) * limit

    const quejas = await sql`
      SELECT q.*, e.nombre_entidad
      FROM quejas q
      JOIN entidades e ON q.id_entidad = e.id_entidad
      WHERE q.id_entidad = ${entidadId}
      ORDER BY q.id_queja
      LIMIT ${limit} OFFSET ${offset}
    `

    const [{ count }] = await sql`
      SELECT COUNT(*)::int AS count FROM quejas
      WHERE id_entidad = ${entidadId}
    `

    return {
      data: quejas,
      page,
      limit,
      total: count,
      totalPages: Math.ceil(count / limit)
    }
  } catch (error) {
    console.error(error)
    throw new Error('Error al obtener las quejas')
  }
}


export const loadEntidades = async () => {
  const entidades = await sql`
    SELECT * FROM entidades
    ORDER BY nombre_entidad 
  `
  setEntidadesCache(entidades)
}

// Devuelve todas las entidades (para el formulario de registrar quejas)
export const getEntidades = async () => {
  try {
    const entidades = await sql`
      SELECT * FROM entidades
      ORDER BY id_entidad
    `
    return entidades
  } catch (error) {
    console.error(error)
    throw new Error('Error al obtener las entidades')
  }
}

//Parte relacionada a registrar quejas
export const createQueja = async ({ texto, id_entidad }) => {
  if (!texto || texto.trim().length < 10 || texto.trim().length > 2000) {
    throw new Error('La queja debe tener entre 10 y 2000 caracteres')
  }

  // validar si la entidad existe
  const [entidad] = await sql`
    SELECT id_entidad FROM entidades WHERE id_entidad = ${id_entidad}
  `
  if (!entidad) {
    throw new Error('La entidad especificada no existe')
  }

  // se insertan quejas
  const [nuevaQueja] = await sql`
    INSERT INTO quejas (descripcion_queja, id_entidad)
    VALUES (${texto.trim()}, ${id_entidad})
    RETURNING *
  `

  return nuevaQueja
}


// Reporte: número de quejas por entidad
export const getReporteQuejasPorEntidad = async () => {
  try {
    const res = await sql`
      SELECT e.id_entidad, e.nombre_entidad, COUNT(q.id_queja) AS total_quejas
      FROM entidades e
      LEFT JOIN quejas q ON e.id_entidad = q.id_entidad
      GROUP BY e.id_entidad, e.nombre_entidad
      ORDER BY total_quejas DESC
    `
    return res;
  } catch (err) {
    console.error('Error generando reporte de quejas por entidad:', err);
    throw err;
  }
}




