require('dotenv').config();
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var listaQuejasRouter = require('./routes/listaQuejas');
var quejasRouter = require('./routes/quejas');
var reportesRouter = require('./routes/reportes');
const { loadEntities } = require('./services/quejas.service');

var app = express();


app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'pug');


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'src/public')));

app.use(express.static(path.join(__dirname, 'src/views')));


app.use('/api/quejas', quejasRouter);
app.use('/api/reportes', reportesRouter);
app.use('/', listaQuejasRouter);

loadEntities();


app.use(function (req, res, next) {
  next(createError(404));
});


app.use(function (err, req, res) {
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
    function (renderErr, html) {
      if (renderErr) {

        console.error('No se pudo renderizar la vista de error:', renderErr.message);
        return res.send(`<h1>Error</h1><pre>${err.message}</pre>`);
      }
      res.send(html);
    }
  );
});

module.exports = app;
