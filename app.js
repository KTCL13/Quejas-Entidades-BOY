require('dotenv').config();
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var morganLogger = require('morgan');
var logger = require('./uttils/logger');

var index = require('./routes/index');
var complaintsRouter = require('./routes/complaints');
var reportesRouter = require('./routes/reportes');
var commentsRouter = require('./routes/comments');
const loginRouter = require('./routes/authRoutes');
const { loadEntidades } = require('./services/quejas.service');

var app = express();

app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'pug');

app.use(morganLogger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));

app.use(express.static(path.join(__dirname, 'views')));

app.use('/api/complaints', complaintsRouter);
app.use('/api/reports', reportesRouter);
app.use('/', index);
app.use('/api/comments', commentsRouter);
app.use('/api', loginRouter);

app.get('/unauthorized', (req, res) => {
  res.render('unauthorized');
});

loadEntidades();
app.get('/login', (req, res) => {
  res.render('login', { activePage: '' });
});

app.use(function (req, res, next) {
  next(createError(404));
});

app.use(function (err, req, res) {
  res.status(err.status || 500);
  const isApi = req.originalUrl && req.originalUrl.startsWith('/api');
  const wantsJson = req.accepts && req.accepts('json') === 'json';

  logger.error(`Error ${err.status || 500}: ${err.message}`, {
    url: req.originalUrl,
    method: req.method,
    stack: err.stack,
  });

  if (isApi || wantsJson) {
    return res.json({
      message: err.message,
      error: req.app.get('env') === 'development' ? err : {},
    });
  }

  res.render(
    'error',
    {
      message: err.message,
      error: req.app.get('env') === 'development' ? err : {},
    },
    function (renderErr, html) {
      if (renderErr) {
        logger.error('No se pudo renderizar la vista de error', {
          error: renderErr.message,
          originalError: err.message,
        });
        return res.send(`<h1>Error</h1><pre>${err.message}</pre>`);
      }
      res.send(html);
    }
  );
});

module.exports = app;
