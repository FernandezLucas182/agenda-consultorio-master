const db = require('../models/Db');
const bcrypt = require('bcryptjs');

// Mostrar el formulario de login
exports.getLogin = (req, res) => {
    res.render('login');
};

// Manejar el login
exports.postLogin = (req, res) => {

    const { username, password } = req.body;

    const query = `
        SELECT *
        FROM usuarios
        WHERE username = ?
        AND activo = 1
    `;

    db.query(query, [username], (err, result) => {

        if (err) {
            console.error(err);
            return res.status(500).render('login', {
                error: 'Error en la base de datos'
            });
        }

        if (result.length === 0) {
            return res.status(401).render('login', {
                error: 'Usuario no encontrado o inactivo'
            });
        }

        const user = result[0];

        const passwordOk = bcrypt.compareSync(password, user.password);

        if (!passwordOk) {
            return res.status(401).render('login', {
                error: 'Contraseña incorrecta'
            });
        }

        // Guardar sesión
        req.session.user = {
            id: user.id,
            username: user.username,
            nombre: user.nombre,
            role: user.rol,
            sucursal_id: user.sucursal_id,
            profesional_id: user.profesional_id
        };

        // Redirección única (no inventamos rutas todavía)
        return res.redirect('/');
    });
};

// Cerrar sesión
exports.logout = (req, res) => {

    req.session.destroy(err => {

        if (err) {
            console.error(err);
            return res.redirect('/');
        }

        res.redirect('/login');

    });

};