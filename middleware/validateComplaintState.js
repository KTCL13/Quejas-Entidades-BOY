const { checkAdminPass } = require('../services/quejas.service');

async function validateComplaintState(req, res, next) {
  const { newState } = req.body;
  const id = req.params.id;

  // Validar datos requeridos
  if (!id || !newState) {
    return res
      .status(400)
      .json({ error: 'ID de queja y nuevo estado son requeridos.' });
  }

  // Validar credenciales de administrador
  const isValidAdmin = await checkAdminPass(req);
  if (!isValidAdmin) {
    return res
      .status(401)
      .json({ error: 'Acceso denegado. Credenciales inválidas.' });
  }

  // Si todo está bien → continuar
  next();
}

module.exports = { validateComplaintState };
