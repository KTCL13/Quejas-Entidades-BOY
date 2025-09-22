const express = require('express');
const router = express.Router();

const { getEntitiesCache } = require('../config/cache');
const { createQueja, getQuejasPaginadasForEntity, getReporteQuejasPorEntidad, deleteComplaint, changeComplaintState, getComplaintById, getComplaintStates} = require('../services/quejas.service');
const { enviarCorreo } = require('../services/email.service'); //importamos el servicio de correo email.srviece.js
const { verifyRecaptcha } = require('../middleware/recaptcha');

// GET /registrar → renderiza el formulario con entidades
router.get('/registrar', async (req, res) => {
  try {
    const entidades = getEntitiesCache() || [];
    res.render('registrar', { entidades, activePage: 'registrar' });
  } catch {
    res.render('registrar', { entidades: [], activePage: 'registrar' });
  }
});

// POST /api/quejas → crea una nueva queja
router.post('/', async (req, res) => {
  try {
    const { texto, entity_id } = req.body;

    if (!texto || texto.trim().length < 10 || texto.trim().length > 2000) {
      return res.status(400).json({ error: "La queja debe tener entre 10 y 2000 caracteres." });
    }
    if (!entity_id || isNaN(entity_id)) {
      return res.status(400).json({ error: "Debe seleccionar una entidad válida." });
    }
    const queja = await createQueja({ texto, entity_id });
    res.status(201).json({ message: "Queja registrada", data: queja });
  } catch {
    res.status(500).json({ error: 'Error al registrar la queja.' });
  }
});



// Controlador para obtener quejas paginadas
async function obtenerQuejas(req, res) {
  try {
    const entidadId = parseInt(req.query.entidadId, 10);
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    if (!entidadId || isNaN(entidadId)) {
      return res.status(400).json({ error: 'Debe seleccionar una entidad válida.' });
    }

    if (process.env.NODE_ENV !== 'test') {
      const token = req.headers['x-recaptcha-token'];
      if (!token) {
        return res.status(400).json({ error: 'Token de reCAPTCHA faltante.' });
      }
      const recaptchaOk = await verifyRecaptcha(token);
      if (!recaptchaOk) {
        return res.status(403).json({ error: 'Fallo la verificación de reCAPTCHA.' });
      }
    }
    // 🔹 Metadatos para el correo
    const clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    // Enviar correo de notificación
    await enviarCorreo({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_TO,
      subject: "Consulta de lista de quejas",
      text: `Un usuario consultó la lista de quejas (entidadId=${entidadId}) desde la IP: ${clientIp}`
    });

    // 🔹 Obtener datos de quejas

    const result = await getQuejasPaginadasForEntity(entidadId, page, limit);
    res.json(result);
  } catch {
    res.status(500).json({ error: 'Error al obtener las quejas.' });
  }
}

// GET /api/quejas → lista paginada por entidad
router.get('/', obtenerQuejas);

//DELETE/api/complaints/:id 
router.delete('/:id', async (req, res) => {
  try {
    const complaintId = parseInt(req.params.id, 10);
    if (isNaN(complaintId)) {
      return res.status(400).json({ error: 'ID de queja inválido.' });
    }

    if (!await checkAdminPass(req)) {
      return res.status(401).json({ error: 'Acceso denegado. Credenciales inválidas.' });
    }

    if (await handleDeleteComplaint(complaintId)) {
      res.json({ message: 'Queja eliminada correctamente.' });
    } else {
      res.status(404).json({ error: 'Queja no encontrada.' });
    }
  } catch {
    res.status(500).json({ error: 'Error al eliminar la queja.' });
  }
});

async function handleDeleteComplaint(complaintId) {
  try {
    const result = await deleteComplaint(complaintId);
    return result > 0;
  } catch (error) {
    console.error('Error al eliminar la queja:', error);
    throw new Error('Error al eliminar la queja');
  }
}

async function checkAdminPass(req) {
  const adminPass = req.headers['x-admin-pass'];
  if (adminPass !== process.env.ADMIN_PASS) {
    return false;
  }
  return true;
}

// GET /api/quejas/quejas-por-entidad → reporte
router.get('/quejas-por-entidad', async (req, res) => {
  try {
    const rows = await getReporteQuejasPorEntidad();
    res.json(rows);
  } catch (err) {
    console.error('Error en /api/reportes/quejas-por-entidad:', err.message || err);
    res.status(500).json({ error: 'Error al generar el reporte', details: err.message });
  }
});

// PUT /api/complaints/cambiar-estado
router.put('/change-state/:id', async (req, res) => {
  try {
    const { newState } = req.body;
    const id = req.params.id;

    if (!id || !newState) {
      return res.status(400).json({ error: 'ID de queja y nuevo estado son requeridos.' });
    }

    if (!await checkAdminPass(req)) {
      return res.status(401).json({ error: 'Acceso denegado. Credenciales inválidas.' });
    }

    const result = await changeComplaintState(id, newState);
    if (result) {
      res.json({ message: 'Estado de la queja actualizado correctamente.' });
    } else {
      res.status(404).json({ error: 'Queja no encontrada.' });
    }
  } catch (err) {
    console.error('Error en /api/complaints/cambiar-estado:', err.message || err);
    res.status(500).json({ error: 'Error al cambiar el estado de la queja.', details: err.message });
  }
});


//GET /api/complaints/:id
router.get('/:id', async (req, res) => {
  try {
    const complaintId = parseInt(req.params.id, 10);
    if (isNaN(complaintId)) {
      return res.status(400).json({ error: 'ID de queja inválido.' });
    }

    const complaint = await getComplaintById(complaintId);
    if (complaint) {
      res.json(complaint);
    } else {
      res.status(404).json({ error: 'Queja no encontrada.' });
    }
  } catch (err) {
    console.error('Error en /api/complaints/:id:', err.message || err);
    res.status(500).json({ error: 'Error al obtener la queja.', details: err.message });
  }
});

// GET /api/complaints/states
router.get('/data/states', async (req, res) => {
  try {
    const states = await getComplaintStates();
    res.json(states);
  } catch (err) {
    console.error('Error en /api/complaints/states:', err.message || err);
    res.status(500).json({ error: 'Error al obtener los estados de las quejas.', details: err.message });
  }
});

module.exports = router;
