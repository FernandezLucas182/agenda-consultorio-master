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

    const userRole = req.session.user.rol;

    if (!roles.includes(userRole)) {
      return res.status(403).send('No autorizado');
    }

    next();
  };
}

module.exports = {
  isAuthenticated,
  authorize
};