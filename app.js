const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');
const logger = require('morgan');
const cookieParser = require('cookie-parser');

const routes = require('./routes/index'); // 👈 SOLO ESTE

const app = express();
const PORT = process.env.PORT || 3000;

// =====================
// Middlewares básicos
// =====================

app.use(logger('dev'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// =====================
// Session + flash
// =====================S

app.use(session({
  secret: 'tu_secreto_aqui',
  resave: false,
  saveUninitialized: false,
}));

app.use(flash());

app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

// =====================
// Motor de plantillas
// =====================

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// =====================
// Rutas (UNA SOLA FUENTE)
// =====================

app.use('/', routes);   // 👈 acá vive TODO ahora

// =====================
// 404
// =====================

app.use((req, res, next) => {
  const err = new Error('No encontrado');
  err.status = 404;
  next(err);
});

// =====================
// Error global
// =====================

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500);
  res.render('error', { message: err.message, error: err });
});

// =====================
// Server
// =====================

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
