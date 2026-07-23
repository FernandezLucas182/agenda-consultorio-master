const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const open = require('open');
const routes = require('./routes/index');

console.log("APP INICIADA", process.pid);


const app = express();
const PORT = process.env.PORT || 3000;

// =====================
// view engine
// =====================
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// =====================
// middlewares base
// =====================
app.use(logger('dev'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// =====================
// session + flash (UNA SOLA VEZ)
// =====================
app.use(session({
  secret: 'agenda-secret',
  resave: false,
  saveUninitialized: false
}));

app.use((req, res, next) => {
  res.locals.path = req.path;
  next();
});



app.use(flash());

// opcional: pasar flash a todas las vistas
app.use((req, res, next) => {
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
});

app.use((req, res, next) => {
  res.locals.usuario = req.session.user || null;
  next();
});

// =====================
// CONTADOR REPROGRAMACIONES
// =====================
const db = require('./models/Db');
const SolicitudAusencia = require('./models/SolicitudAusencia');

app.use((req, res, next) => {

  db.query(
    `
    SELECT COUNT(*) AS total
    FROM turnos
    WHERE estado = 'reprogramar'
    `,
    (err, rows) => {

      if (err) {
        console.error("ERROR CONTADOR REPROGRAMACIONES:", err);
        res.locals.cantidadReprogramaciones = 0;
      } else {
        res.locals.cantidadReprogramaciones = rows[0].total;
      }

      next();

    }
  );

});




// =====================
// CONTADOR SOLICITUDES AUSENCIAS
// =====================



app.use((req, res, next) => {

  if (
    req.session.user &&
    (req.session.user.rol === 'admin' || req.session.user.rol === 'secretaria')
  ) {

    SolicitudAusencia.contarPendientes((err, total) => {

      if (err) {
        console.error("ERROR CONTADOR AUSENCIAS:", err);
        res.locals.cantidadSolicitudesAusencias = 0;
      } else {
        res.locals.cantidadSolicitudesAusencias = total;
      }

      next();

    });

  } else {

    res.locals.cantidadSolicitudesAusencias = 0;
    next();

  }

});


// =====================
// routes
// =====================
app.use('/', routes);

// =====================
// 404
// =====================
app.use((req, res, next) => {
  const err = new Error('No encontrado');
  err.status = 404;
  next(err);
});

// =====================
// error handler (AL FINAL)
// =====================
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500);
  res.render('error', { message: err.message, error: err });
});

// =====================
app.listen(PORT, async () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);

  try {
    const open = (await import('open')).default;
    await open(`http://localhost:${PORT}`);
  } catch (err) {
    console.error('No se pudo abrir el navegador:', err);
  }
});