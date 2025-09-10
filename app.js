require('dotenv').config();
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

// Rutas
const listaQuejasRouter = require('./routes/listaQuejas');
const quejasRouter = require('./routes/quejas');
const reportesRouter = require('./routes/reportes');
const { loadEntidades } = require('./services/quejas.service');

const app = express();

// Configuración de vistas
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'pug');

// Middlewares
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Archivos estáticos
app.use(express.static(path.join(__dirname, 'src/public')));

// Rutas
app.use('/api/quejas', quejasRouter);
app.use('/api/reportes', reportesRouter);
app.use('/', listaQuejasRouter);

// Inicializar entidades
loadEntidades();

// catch 404
app.use((req, res, next) => {
  next(createError(404));
});

// Error handler
app.use((err, req, res) => {
  res.status(err.status || 500);
  const isApi = req.originalUrl && req.originalUrl.startsWith('/api');
  const wantsJson = req.accepts && req.accepts('json') === 'json';

  if (isApi || wantsJson) {
    return res.json({
      message: err.message,
      error: req.app.get('env') === 'development' ? err : {}
    });
  }

  res.render(
    'error',
    { message: err.message, error: req.app.get('env') === 'development' ? err : {} },
    (renderErr, html) => {
      if (renderErr) {
        console.error('No se pudo renderizar la vista de error:', renderErr.message);
        return res.send(`<h1>Error</h1><pre>${err.message}</pre>`);
      }
      res.send(html);
    }
  );
});

module.exports = app;
