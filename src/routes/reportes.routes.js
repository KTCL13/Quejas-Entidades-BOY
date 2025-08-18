const express = require('express');
const router = express.Router();
const { pool } = require('../database');

router.get('/quejas-por-entidad', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT e.nombre_entidad, COUNT(q.id) as total_quejas
            FROM entidades e
            LEFT JOIN quejas q ON e.id = q.entidad_id
            GROUP BY e.id, e.nombre_entidad
            ORDER BY total_quejas DESC
        `);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el reporte', error });
    }
});

module.exports = router;
