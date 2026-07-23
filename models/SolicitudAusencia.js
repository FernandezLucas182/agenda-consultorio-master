const db = require('./Db');


class SolicitudAusencia {


    static crear(datos, callback) {


        const sql = `
            INSERT INTO solicitudes_ausencias
            (
                agenda_id,
                fecha_inicio,
                fecha_fin,
                motivo
            )
            VALUES (?, ?, ?, ?)
        `;


        db.query(
            sql,
            [
                datos.agenda_id,
                datos.fecha_inicio,
                datos.fecha_fin,
                datos.motivo
            ],
            callback
        );

    }


    static obtenerPendientes(callback) {


        const sql = `
            SELECT
                sa.*,
                CONCAT(p.nombre,' ',p.apellido) AS profesional

            FROM solicitudes_ausencias sa

            INNER JOIN agendas ag
                ON ag.id = sa.agenda_id

            INNER JOIN profesionales p
                ON p.id = ag.profesional_id

            WHERE sa.estado = 'pendiente'

            ORDER BY sa.fecha_solicitud DESC
        `;


        db.query(sql, callback);

    }


    static contarPendientes(callback) {

        db.query(
            `
      SELECT COUNT(*) AS total
      FROM solicitudes_ausencias
      WHERE estado='pendiente'
      `,
            (err, rows) => {

                if (err) return callback(err);

                callback(null, rows[0].total);

            }
        );

    }


    static cambiarEstado(id, estado, callback) {


        const sql = `
            UPDATE solicitudes_ausencias
            SET estado = ?
            WHERE id = ?
        `;


        db.query(
            sql,
            [
                estado,
                id
            ],
            callback
        );

    }


    static aprobar(id, callback) {

        const sql = `
    UPDATE solicitudes_ausencias
    SET estado='aprobada'
    WHERE id=?
    `;

        db.query(sql, [id], callback);

    }



    static rechazar(id, callback) {

        const sql = `
    UPDATE solicitudes_ausencias
    SET estado='rechazada'
    WHERE id=?
    `;

        db.query(sql, [id], callback);

    }

}


module.exports = SolicitudAusencia;