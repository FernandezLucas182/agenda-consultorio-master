const db = require('../models/Db'); 
const bcrypt = require('bcryptjs');

// Mostrar el formulario de login
exports.getLogin = (req, res) => {
    res.render('login');
};

// Manejar el login
exports.postLogin = (req, res) => {
    const { username, password } = req.body;

    // Consultar usuario en la base de datos
    const query = 'SELECT * FROM usuarios WHERE username = ?';

    db.query(query, [username], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).send('Error en la base de datos');
        }

        if (result.length === 0) {
            return res.send('Usuario no encontrado');
        }

        const user = result[0];

        // Verificar la contraseña
        if (bcrypt.compareSync(password, user.password)) {
            req.session.role = user.role;

            // Redireccionar basado en el rol del usuario
            if (user.role === 'admin') {
                res.redirect('/agenda/admin');
            } else if (user.role === 'medico') {
                res.redirect('/agenda/medico');
            } else {
                res.redirect('/agenda/usuario');
            }
        } else {
            res.send('Contraseña incorrecta');
        }
    });
};

// Cerrar sesión
exports.logout = (req, res) => {
    req.session.destroy();
    res.redirect('/auth/login');
};