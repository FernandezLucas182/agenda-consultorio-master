const db = require('../models/Db');
const bcrypt = require('bcryptjs');

exports.listarUsuarios = (req, res) => {

    const sql = `
        SELECT
            u.id,
            u.username,
            u.nombre,
            u.email,
            u.rol,
            u.activo,
            p.nombre AS nombre_profesional,
            p.apellido AS apellido_profesional
        FROM usuarios u
        LEFT JOIN profesionales p
            ON u.profesional_id = p.id
        ORDER BY u.nombre;
    `;

    db.query(sql, (err, usuarios) => {

        if (err) {
            console.error(err);
            return res.status(500).send('Error al obtener usuarios');
        }

        res.render('usuarios/listar', {
            usuarios,
            tempPassword: req.session.tempPassword || null
        });

        delete req.session.tempPassword;
    });

};


exports.formularioNuevoUsuario = (req, res) => {

    const sql = `
        SELECT
            id,
            nombre,
            apellido
        FROM profesionales
        WHERE estado='activo'
        ORDER BY apellido, nombre
    `;

    db.query(sql, (err, profesionales) => {

        if (err) {
            console.error(err);
            return res.status(500).send('Error');
        }

        res.render('usuarios/nuevo', {
            profesionales
        });

    });

};



exports.crearUsuario = async (req, res) => {

    const {
        nombre,
        apellido,
        email,
        telefono,
        username,
        password,
        rol,
        profesional_id
    } = req.body;

    // =========================
    // 1. VALIDACIÓN BÁSICA
    // =========================
    if (!username || !password || !rol) {
        req.flash('error', 'Complete usuario, contraseña y rol.');
        return res.redirect('/usuarios/nuevo');
    }

    try {

        let nombreFinal = nombre;
        let emailFinal = email;

        // =========================
        // 2. MÉDICO (SINCRONIZADO CON PROFESIONAL)
        // =========================
        if (rol === 'medico') {

            if (!profesional_id) {
                req.flash('error', 'Debe seleccionar un profesional.');
                return res.redirect('/usuarios/nuevo');
            }

            const prof = await new Promise((resolve, reject) => {
                db.query(
                    'SELECT nombre, apellido, email FROM profesionales WHERE id = ?',
                    [profesional_id],
                    (err, rows) => {
                        if (err) return reject(err);
                        resolve(rows);
                    }
                );
            });

            if (!prof.length) {
                req.flash('error', 'Profesional inválido.');
                return res.redirect('/usuarios/nuevo');
            }

            nombreFinal = `${prof[0].nombre} ${prof[0].apellido}`;
            emailFinal = prof[0].email || null;
        }

        // =========================
        // 3. VALIDAR USERNAME
        // =========================
        const usuarioExistente = await new Promise((resolve, reject) => {
            db.query(
                'SELECT id FROM usuarios WHERE username = ?',
                [username],
                (err, rows) => {
                    if (err) return reject(err);
                    resolve(rows);
                }
            );
        });

        if (usuarioExistente.length > 0) {
            req.flash('error', 'Ese usuario ya existe.');
            return res.redirect('/usuarios/nuevo');
        }

        // =========================
        // 4. VALIDAR PROFESIONAL DUPLICADO
        // =========================
        if (profesional_id) {

            const usado = await new Promise((resolve, reject) => {
                db.query(
                    'SELECT id FROM usuarios WHERE profesional_id = ?',
                    [profesional_id],
                    (err, rows) => {
                        if (err) return reject(err);
                        resolve(rows);
                    }
                );
            });

            if (usado.length > 0) {
                req.flash('error', 'Ese profesional ya tiene usuario.');
                return res.redirect('/usuarios/nuevo');
            }
        }

        // =========================
        // 5. HASH PASSWORD
        // =========================
        const passwordHash = await bcrypt.hash(password, 10);

        // =========================
        // 6. INSERT
        // =========================
        await new Promise((resolve, reject) => {
            db.query(
                `INSERT INTO usuarios
                (username, password, nombre, email, telefono, rol, profesional_id, activo)
                VALUES (?, ?, ?, ?, ?, ?, ?, 1)`,

                [
                    username,
                    passwordHash,
                    nombreFinal,
                    emailFinal,
                    telefono || null,
                    rol,
                    profesional_id || null
                ],

                (err) => {
                    if (err) return reject(err);
                    resolve();
                }
            );
        });

        req.flash('success', 'Usuario creado correctamente.');
        res.redirect('/usuarios');

    } catch (error) {
        console.error(error);
        req.flash('error', 'Error inesperado.');
        res.redirect('/usuarios');
    }
};

exports.formularioEditarUsuario = (req, res) => {
    console.log("🔥 ENTRO A EDITAR USUARIO");

    db.query(
        'SELECT * FROM usuarios WHERE id = ?',
        [req.params.id],
        (err, rows) => {

            if (err || rows.length === 0) {
                return res.redirect('/usuarios');
            }

            res.render('usuarios/editar', {
                usuario: rows[0]
            });

        }
    );

};

exports.editarUsuario = (req, res) => {

    const {
        username,
        nombre,
        email,
        telefono,
        rol
    } = req.body;

    db.query(
        `
        UPDATE usuarios
        SET
            username=?,
            nombre=?,
            email=?,
            telefono=?,
            rol=?
        WHERE id=?
        `,
        [
            username,
            nombre,
            email,
            telefono,
            rol,
            req.params.id
        ],
        (err) => {

            if (err) {
                console.error(err);
                req.flash('error', 'No se pudo actualizar el usuario');
                return res.redirect('/usuarios');
            }

            req.flash('success', 'Usuario actualizado');
            res.redirect('/usuarios');

        }
    );

};




exports.formularioPassword = (req, res) => {

    res.render('usuarios/password', {
        id: req.params.id
    });

};

exports.guardarPassword = async (req, res) => {

    const { password } = req.body;

    if (!password) {
        req.flash('error', 'Debe ingresar una contraseña.');
        return res.redirect(`/usuarios/${req.params.id}/password`);
    }

    const hash = await bcrypt.hash(password, 10);

    db.query(
        'UPDATE usuarios SET password = ? WHERE id = ?',
        [hash, req.params.id],
        (err) => {

            if (err) {
                console.error(err);
                req.flash('error', 'No se pudo cambiar la contraseña.');
                return res.redirect('/usuarios');
            }

            req.flash('success', 'Contraseña actualizada.');
            res.redirect('/usuarios');
        }
    );

};




exports.resetPassword = async (req, res) => {

    try {

        const id = req.params.id;

        // Contraseña aleatoria
        const caracteres =
            'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789';

        let nuevaPassword = '';

        for (let i = 0; i < 8; i++) {
            nuevaPassword += caracteres.charAt(
                Math.floor(Math.random() * caracteres.length)
            );
        }

        const hash = await bcrypt.hash(nuevaPassword, 10);

        db.query(
            'UPDATE usuarios SET password = ? WHERE id = ?',
            [hash, id],
            (err) => {

                if (err) {
                    console.error(err);

                    req.flash(
                        'error',
                        'No se pudo resetear la contraseña.'
                    );

                    return res.redirect('/usuarios');
                }

                req.session.tempPassword = nuevaPassword;
                res.redirect(`/usuarios/${id}/password-generada`);

            }
        );

    } catch (error) {

        console.error(error);

        req.flash(
            'error',
            'Error al resetear contraseña.'
        );

        res.redirect('/usuarios');

    }

};



exports.mostrarPasswordGenerada = (req, res) => {

    const password = req.session.tempPassword;

    if (!password) {
        return res.redirect('/usuarios');
    }

    // opcional: borrar después de mostrarla una vez
    delete req.session.tempPassword;

    res.render('usuarios/password-generada', {
        password
    });
};