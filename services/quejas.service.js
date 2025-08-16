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
    ORDER BY id_entidad
  `

  setEntidadesCache(entidades)
}