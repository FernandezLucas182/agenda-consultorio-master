function isAuthenticated(req, res, next) {
  if (req.session && req.session.user) {
    return next();
  }

  return res.redirect('/login');
}

function authorize(...roles) {
  return (req, res, next) => {

    if (!req.session || !req.session.user) {
      return res.redirect('/login');
    }

    if (!roles.includes(req.session.user.rol)) {
      return res.status(403).render("error", {
        message: "No tiene permisos para acceder a esta sección.",
        error: {}
      });
    }

    next();
  };
}

// Atajos

const soloAdmin = authorize("admin");

const soloSecretaria = authorize("secretaria");

const soloProfesional = authorize("profesional");

const adminOSecretaria = authorize("admin", "secretaria");

module.exports = {
  isAuthenticated,
  authorize,
  soloAdmin,
  soloSecretaria,
  soloProfesional,
  adminOSecretaria
};