require('dotenv').config();
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var quejasRouter = require('./routes/quejas');
var reportesRouter = require('./routes/reportes');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'src/views'));
app.set('view engine', 'pug');

// Middlewares generales
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// servir archivos estáticos (css/js) desde src/public
app.use(express.static(path.join(__dirname, 'src/public')));
// además servir archivos HTML estáticos que están en src/views (p.ej. reportes.html)
app.use(express.static(path.join(__dirname, 'src/views')));

// Rutas API
app.use('/api/quejas', quejasRouter);
app.use('/api/reportes', reportesRouter);
app.use('/users', usersRouter);
app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  const isApi = req.originalUrl && req.originalUrl.startsWith('/api');
  const wantsJson = req.accepts && req.accepts('json') === 'json';

  if (isApi || wantsJson) {
    return res.json({
      message: err.message,
      error: req.app.get('env') === 'development' ? err : {}
    });
  }

  // Intentar renderizar la vista 'error'; si no existe, devolver HTML plano
  res.render('error', { message: err.message, error: req.app.get('env') === 'development' ? err : {} }, function(renderErr, html) {
    if (renderErr) {
      // Vista no encontrada o fallo al renderizar -> enviar HTML simple
      console.error('No se pudo renderizar la vista de error:', renderErr.message);
      return res.send(`<h1>Error</h1><pre>${err.message}</pre>`);
    }
    res.send(html);
  });
});

module.exports = app;
