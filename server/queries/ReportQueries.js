const db = require('../db_connection');
const getAllUsers = async (startDate, endDate) => {
    try {
        let query = `
            SELECT
            cliente.id_cliente,
            CASE
                WHEN h.id_cliente IS NOT NULL OR l.id_cliente IS NOT NULL THEN 'Huesped'
                ELSE 'Visitante'
            END AS tipo_usuario,
            cliente.nombre_c,
            cliente.apellidos_c,
            CASE
                WHEN cliente.sexo THEN 'Masculino'
                ELSE 'Femenino'
            END AS sexo,
            cliente.lugar_o,
            CASE
                WHEN COALESCE(h.fecha_i, l.fecha_i) IS NULL THEN
                    (SELECT MAX(fecha_u) FROM servcliente WHERE id_cliente = cliente.id_cliente)
                ELSE
                    COALESCE(h.fecha_i, l.fecha_i)
            END AS fecha_i,
            l.fecha_s,
            COALESCE(sc_regadera.cantidad, 0) AS cantidad_regadera,
            COALESCE(sc_bano.cantidad, 0) AS cantidad_bano,
            COALESCE(sc_desayuno.cantidad, 0) AS cantidad_desayuno,
            COALESCE(sc_comida.cantidad, 0) AS cantidad_comida,
            COALESCE(sc_cena.cantidad, 0) AS cantidad_cena,
            cliente.notas_c AS notas_cliente, -- Modificación aquí para obtener las notas de cliente
            COALESCE(total_deuda.total, 0) AS total_deuda
        FROM
            cliente
        LEFT JOIN
            logsalidas l ON cliente.id_cliente = l.id_cliente
        LEFT JOIN
            huesped h ON cliente.id_cliente = h.id_cliente
        LEFT JOIN
            (SELECT id_cliente, SUM(cant) AS cantidad
            FROM servcliente
            WHERE id_servicio = 1
            GROUP BY id_cliente) AS sc_regadera ON cliente.id_cliente = sc_regadera.id_cliente
        LEFT JOIN
            (SELECT id_cliente, SUM(cant) AS cantidad
            FROM servcliente
            WHERE id_servicio = 2
            GROUP BY id_cliente) AS sc_bano ON cliente.id_cliente = sc_bano.id_cliente
        LEFT JOIN
            (SELECT id_cliente, SUM(cant) AS cantidad
            FROM servcliente
            WHERE id_servicio = 3
            GROUP BY id_cliente) AS sc_desayuno ON cliente.id_cliente = sc_desayuno.id_cliente
        LEFT JOIN
            (SELECT id_cliente, SUM(cant) AS cantidad
            FROM servcliente
            WHERE id_servicio = 4
            GROUP BY id_cliente) AS sc_comida ON cliente.id_cliente = sc_comida.id_cliente
        LEFT JOIN
            (SELECT id_cliente, SUM(cant) AS cantidad
            FROM servcliente
            WHERE id_servicio = 5
            GROUP BY id_cliente) AS sc_cena ON cliente.id_cliente = sc_cena.id_cliente
        LEFT JOIN
            vetado v ON cliente.id_cliente = v.id_cliente
        LEFT JOIN
            (SELECT id_cliente, ABS(SUM(monto_t)) AS total
            FROM pago
            GROUP BY id_cliente) AS total_deuda ON cliente.id_cliente = total_deuda.id_cliente`;

        let params = [];

        // Verificar si se proporcionaron fechas como parámetros
        if (startDate && endDate) {
            query = `
                SELECT *,
                    CASE
                        WHEN fecha_i IS NULL THEN (SELECT MAX(fecha_u) FROM servcliente WHERE id_cliente = allusers.id_cliente)
                        ELSE fecha_i
                    END AS fecha_i,
                    fecha_s
                FROM (${query}) AS allusers
                WHERE (fecha_i >= $1 AND fecha_i <= $2 AND (fecha_s IS NULL OR (fecha_s >= $1 AND fecha_s <= $2 OR fecha_s = $2))) 
                ORDER BY allusers.fecha_i ASC, allusers.fecha_s ASC`;
            params = [startDate, endDate];
        }

        const users = await db.any(query, params);
        return users;
    } catch (error) {
        throw error;
    }
}



const getAllHuespedes = async () => {
    try {
        const allHuespedes = await db.any(
            `SELECT
            cliente.id_cliente AS id_huesped,
            cliente.nombre_c AS nombre,
            cliente.apellidos_c AS apellidos
        FROM
            cliente
        LEFT JOIN
            huesped h ON cliente.id_cliente = h.id_cliente
        LEFT JOIN
            logsalidas ls ON cliente.id_cliente = ls.id_cliente
        WHERE
            h.id_cliente IS NOT NULL OR ls.id_cliente IS NOT NULL`,
        )
        return allHuespedes;
    } catch (error) {
        throw error;
    }
}

const getAllVisitantes = async () => {
    try {
        const allVisitantes = await db.any(
            `SELECT
            cliente.id_cliente AS id_visitante,
            cliente.nombre_c AS nombre,
            cliente.apellidos_c AS apellidos
        FROM
            cliente
        LEFT JOIN
            huesped h ON cliente.id_cliente = h.id_cliente
        LEFT JOIN
            logsalidas l ON cliente.id_cliente = l.id_cliente
        WHERE
            h.id_cliente IS NULL
            AND l.id_cliente IS NULL
            AND cliente.id_cliente NOT IN (SELECT id_cliente FROM vetado)`,
        )
        return allVisitantes;
    } catch (error) {
        throw error;
    }
}

const getAllVetados = async () => {
    try {
        const allVetados = await db.any(
            `SELECT
            cliente.id_cliente AS id_vetado,
            cliente.nombre_c AS nombre,
            cliente.apellidos_c AS apellidos
        FROM
            cliente
        LEFT JOIN
            vetado v ON cliente.id_cliente = v.id_cliente
        WHERE
            v.id_cliente IS NOT NULL
        `,
        )
        return allVetados;
    } catch (error) {
        throw error;
    }
}

const getUserInfo = async (userId) => {
    try {
        const getuserId = await db.any(
            `SELECT
            cliente.id_cliente,
            CASE
                WHEN h.id_cliente IS NOT NULL OR l.id_cliente IS NOT NULL THEN 'Huesped'
                ELSE 'Visitante'
            END AS tipo_usuario,
            cliente.nombre_c,
            cliente.apellidos_c,
            CASE
                WHEN cliente.sexo THEN 'Masculino'
                ELSE 'Femenino'
            END AS sexo,
            cliente.lugar_o,
            CASE
                WHEN COALESCE(h.fecha_i, l.fecha_i) IS NULL THEN
                    (SELECT MAX(fecha_u) FROM servcliente WHERE id_cliente = cliente.id_cliente)
                ELSE
                    COALESCE(h.fecha_i, l.fecha_i)
            END AS fecha_i,
            CASE
                WHEN v.id_cliente IS NOT NULL THEN v.fecha_v -- Utiliza fecha_v cuando el cliente está vetado
                ELSE l.fecha_s
            END AS fecha_s,
            COALESCE(sc_regadera.cantidad, 0) AS cantidad_regadera,
            COALESCE(sc_bano.cantidad, 0) AS cantidad_bano,
            COALESCE(sc_desayuno.cantidad, 0) AS cantidad_desayuno,
            COALESCE(sc_comida.cantidad, 0) AS cantidad_comida,
            COALESCE(sc_cena.cantidad, 0) AS cantidad_cena,
            cliente.notas_c AS notas_cliente, -- Modificación aquí para obtener las notas de cliente
            v.notas_v AS notas_v, -- Agregar notas_v de la tabla vetado
            COALESCE(total_deuda.total, 0) AS total_deuda
        FROM
            cliente
        LEFT JOIN
            logsalidas l ON cliente.id_cliente = l.id_cliente
        LEFT JOIN
            huesped h ON cliente.id_cliente = h.id_cliente
        LEFT JOIN
            (SELECT id_cliente, SUM(cant) AS cantidad
             FROM servcliente
             WHERE id_servicio = 1
             GROUP BY id_cliente) AS sc_regadera ON cliente.id_cliente = sc_regadera.id_cliente
        LEFT JOIN
            (SELECT id_cliente, SUM(cant) AS cantidad
             FROM servcliente
             WHERE id_servicio = 2
             GROUP BY id_cliente) AS sc_bano ON cliente.id_cliente = sc_bano.id_cliente
        LEFT JOIN
            (SELECT id_cliente, SUM(cant) AS cantidad
             FROM servcliente
             WHERE id_servicio = 3
             GROUP BY id_cliente) AS sc_desayuno ON cliente.id_cliente = sc_desayuno.id_cliente
        LEFT JOIN
            (SELECT id_cliente, SUM(cant) AS cantidad
             FROM servcliente
             WHERE id_servicio = 4
             GROUP BY id_cliente) AS sc_comida ON cliente.id_cliente = sc_comida.id_cliente
        LEFT JOIN
            (SELECT id_cliente, SUM(cant) AS cantidad
             FROM servcliente
             WHERE id_servicio = 5
             GROUP BY id_cliente) AS sc_cena ON cliente.id_cliente = sc_cena.id_cliente
        LEFT JOIN
            vetado v ON cliente.id_cliente = v.id_cliente
        LEFT JOIN
            (SELECT id_cliente, ABS(SUM(monto_t)) AS total
             FROM pago
             GROUP BY id_cliente) AS total_deuda ON cliente.id_cliente = total_deuda.id_cliente
        WHERE
            cliente.id_cliente = $1
        
        `,
            [userId]
        );
        return getuserId;
    } catch (error) {
        throw error;
    }
}

const getAllGeneralVisitantes = async (startDate, endDate) => {
    try {
        let query = `
            SELECT
            cliente.id_cliente,
            'Visitante' AS tipo_usuario,
            cliente.nombre_c,
            cliente.apellidos_c,
            CASE
                WHEN cliente.sexo THEN 'Masculino'
                ELSE 'Femenino'
            END AS sexo,
            cliente.lugar_o,
            CASE
                WHEN COALESCE(h.fecha_i, l.fecha_i) IS NULL THEN
                    (SELECT MAX(fecha_u) FROM servcliente WHERE id_cliente = cliente.id_cliente)
                ELSE
                    COALESCE(h.fecha_i, l.fecha_i)
            END AS fecha_i,
            l.fecha_s,
            COALESCE(sc_regadera.cantidad, 0) AS cantidad_regadera,
            COALESCE(sc_bano.cantidad, 0) AS cantidad_bano,
            COALESCE(sc_desayuno.cantidad, 0) AS cantidad_desayuno,
            COALESCE(sc_comida.cantidad, 0) AS cantidad_comida,
            COALESCE(sc_cena.cantidad, 0) AS cantidad_cena,
            cliente.notas_c AS notas_cliente, -- Modificación aquí para obtener las notas de cliente
            COALESCE(total_deuda.total, 0) AS total_deuda
        FROM
            cliente
        LEFT JOIN
            logsalidas l ON cliente.id_cliente = l.id_cliente
        LEFT JOIN
            huesped h ON cliente.id_cliente = h.id_cliente
        LEFT JOIN
            (SELECT id_cliente, SUM(cant) AS cantidad
            FROM servcliente
            WHERE id_servicio = 1
            GROUP BY id_cliente) AS sc_regadera ON cliente.id_cliente = sc_regadera.id_cliente
        LEFT JOIN
            (SELECT id_cliente, SUM(cant) AS cantidad
            FROM servcliente
            WHERE id_servicio = 2
            GROUP BY id_cliente) AS sc_bano ON cliente.id_cliente = sc_bano.id_cliente
        LEFT JOIN
            (SELECT id_cliente, SUM(cant) AS cantidad
            FROM servcliente
            WHERE id_servicio = 3
            GROUP BY id_cliente) AS sc_desayuno ON cliente.id_cliente = sc_desayuno.id_cliente
        LEFT JOIN
            (SELECT id_cliente, SUM(cant) AS cantidad
            FROM servcliente
            WHERE id_servicio = 4
            GROUP BY id_cliente) AS sc_comida ON cliente.id_cliente = sc_comida.id_cliente
        LEFT JOIN
            (SELECT id_cliente, SUM(cant) AS cantidad
            FROM servcliente
            WHERE id_servicio = 5
            GROUP BY id_cliente) AS sc_cena ON cliente.id_cliente = sc_cena.id_cliente
        LEFT JOIN
            vetado v ON cliente.id_cliente = v.id_cliente
        LEFT JOIN
            (SELECT id_cliente, ABS(SUM(monto_t)) AS total
            FROM pago
            GROUP BY id_cliente) AS total_deuda ON cliente.id_cliente = total_deuda.id_cliente
        WHERE
            h.id_cliente IS NULL 
            AND l.id_cliente IS NULL
            AND v.id_cliente IS NULL`;

        let params = [];

        // Verificar si se proporcionaron fechas como parámetros
        if (startDate && endDate) {
            query = `
                SELECT *,
                    CASE
                        WHEN fecha_i IS NULL THEN (SELECT MAX(fecha_u) FROM servcliente WHERE id_cliente = allvisitantes.id_cliente)
                        ELSE fecha_i
                    END AS fecha_i,
                    fecha_s
                FROM (${query}) AS allvisitantes
                WHERE (fecha_i >= $1 AND fecha_i <= $2 AND (fecha_s IS NULL OR (fecha_s >= $1 AND fecha_s <= $2 OR fecha_s = $2))) 
                AND tipo_usuario = 'Visitante'  -- Solo tipo de usuario "Visitante"
                ORDER BY allvisitantes.fecha_i ASC, allvisitantes.fecha_s ASC`;
            params = [startDate, endDate];
        }

        const visitantesgeneral = await db.any(query, params);
        return visitantesgeneral;
    } catch (error) {
        throw error;
    }
}

const getAllGeneralHuespedes = async (startDate, endDate) => {
    try {
        let query = `
            SELECT
            cliente.id_cliente,
            'Huesped' AS tipo_usuario,
            cliente.nombre_c,
            cliente.apellidos_c,
            CASE
                WHEN cliente.sexo THEN 'Masculino'
                ELSE 'Femenino'
            END AS sexo,
            cliente.lugar_o,
            COALESCE(h.fecha_i, l.fecha_i) AS fecha_i,
            l.fecha_s,
            COALESCE(sc_regadera.cantidad, 0) AS cantidad_regadera,
            COALESCE(sc_bano.cantidad, 0) AS cantidad_bano,
            COALESCE(sc_desayuno.cantidad, 0) AS cantidad_desayuno,
            COALESCE(sc_comida.cantidad, 0) AS cantidad_comida,
            COALESCE(sc_cena.cantidad, 0) AS cantidad_cena,
            cliente.notas_c AS notas_cliente, -- Modificación aquí para obtener las notas de cliente
            COALESCE(total_deuda.total, 0) AS total_deuda
        FROM
            (
                SELECT id_cliente, fecha_i
                FROM huesped
                UNION
                SELECT id_cliente, fecha_i
                FROM logsalidas
            ) AS hl
        INNER JOIN
            cliente ON cliente.id_cliente = hl.id_cliente
        LEFT JOIN
            huesped h ON cliente.id_cliente = h.id_cliente
        LEFT JOIN
            logsalidas l ON cliente.id_cliente = l.id_cliente
        LEFT JOIN
            (SELECT id_cliente, SUM(cant) AS cantidad
            FROM servcliente
            WHERE id_servicio = 1
            GROUP BY id_cliente) AS sc_regadera ON cliente.id_cliente = sc_regadera.id_cliente
        LEFT JOIN
            (SELECT id_cliente, SUM(cant) AS cantidad
            FROM servcliente
            WHERE id_servicio = 2
            GROUP BY id_cliente) AS sc_bano ON cliente.id_cliente = sc_bano.id_cliente
        LEFT JOIN
            (SELECT id_cliente, SUM(cant) AS cantidad
            FROM servcliente
            WHERE id_servicio = 3
            GROUP BY id_cliente) AS sc_desayuno ON cliente.id_cliente = sc_desayuno.id_cliente
        LEFT JOIN
            (SELECT id_cliente, SUM(cant) AS cantidad
            FROM servcliente
            WHERE id_servicio = 4
            GROUP BY id_cliente) AS sc_comida ON cliente.id_cliente = sc_comida.id_cliente
        LEFT JOIN
            (SELECT id_cliente, SUM(cant) AS cantidad
            FROM servcliente
            WHERE id_servicio = 5
            GROUP BY id_cliente) AS sc_cena ON cliente.id_cliente = sc_cena.id_cliente
        LEFT JOIN
            vetado v ON cliente.id_cliente = v.id_cliente
        LEFT JOIN
            (SELECT id_cliente, ABS(SUM(monto_t)) AS total
            FROM pago
            GROUP BY id_cliente) AS total_deuda ON cliente.id_cliente = total_deuda.id_cliente
        `;

        let params = [];

        // Verificar si se proporcionaron fechas como parámetros
        if (startDate && endDate) {
            query = `
                SELECT *,
                    CASE
                        WHEN fecha_i IS NULL THEN (SELECT MAX(fecha_u) FROM servcliente WHERE id_cliente = allusers.id_cliente)
                        ELSE fecha_i
                    END AS fecha_i,
                    fecha_s
                FROM (${query}) AS allusers
                WHERE (fecha_i >= $1 AND fecha_i <= $2 AND (fecha_s IS NULL OR (fecha_s >= $1 AND fecha_s <= $2 OR fecha_s = $2))) 
                ORDER BY allusers.fecha_i ASC, allusers.fecha_s ASC`;
            params = [startDate, endDate];
        }

        const huespedesgeneral = await db.any(query, params);
        return huespedesgeneral;
    } catch (error) {
        throw error;
    }
}

const getAllGeneralVetados = async (startDate, endDate) => {
    try {
        let query = `
            SELECT
            cliente.id_cliente,
            'Vetado' AS tipo_usuario,
            cliente.nombre_c,
            cliente.apellidos_c,
            CASE
                WHEN cliente.sexo THEN 'Masculino'
                ELSE 'Femenino'
            END AS sexo,
            cliente.lugar_o,
            CASE
                WHEN COALESCE(h.fecha_i, l.fecha_i) IS NULL THEN
                    (SELECT MAX(fecha_u) FROM servcliente WHERE id_cliente = cliente.id_cliente)
                ELSE
                    COALESCE(h.fecha_i, l.fecha_i)
            END AS fecha_i,
            COALESCE(v.fecha_v, l.fecha_s) AS fecha_s, -- Cambio aquí para utilizar fecha_v cuando esté vetado
            COALESCE(sc_regadera.cantidad, 0) AS cantidad_regadera,
            COALESCE(sc_bano.cantidad, 0) AS cantidad_bano,
            COALESCE(sc_desayuno.cantidad, 0) AS cantidad_desayuno,
            COALESCE(sc_comida.cantidad, 0) AS cantidad_comida,
            COALESCE(sc_cena.cantidad, 0) AS cantidad_cena,
            notas_c AS notas_cliente, -- Agregar las notas de cliente
            notas_v,
            COALESCE(total_deuda.total, 0) AS total_deuda
        FROM
            cliente
        LEFT JOIN
            logsalidas l ON cliente.id_cliente = l.id_cliente
        LEFT JOIN
            huesped h ON cliente.id_cliente = h.id_cliente
        LEFT JOIN
            (SELECT id_cliente, SUM(cant) AS cantidad
            FROM servcliente
            WHERE id_servicio = 1
            GROUP BY id_cliente) AS sc_regadera ON cliente.id_cliente = sc_regadera.id_cliente
        LEFT JOIN
            (SELECT id_cliente, SUM(cant) AS cantidad
            FROM servcliente
            WHERE id_servicio = 2
            GROUP BY id_cliente) AS sc_bano ON cliente.id_cliente = sc_bano.id_cliente
        LEFT JOIN
            (SELECT id_cliente, SUM(cant) AS cantidad
            FROM servcliente
            WHERE id_servicio = 3
            GROUP BY id_cliente) AS sc_desayuno ON cliente.id_cliente = sc_desayuno.id_cliente
        LEFT JOIN
            (SELECT id_cliente, SUM(cant) AS cantidad
            FROM servcliente
            WHERE id_servicio = 4
            GROUP BY id_cliente) AS sc_comida ON cliente.id_cliente = sc_comida.id_cliente
        LEFT JOIN
            (SELECT id_cliente, SUM(cant) AS cantidad
            FROM servcliente
            WHERE id_servicio = 5
            GROUP BY id_cliente) AS sc_cena ON cliente.id_cliente = sc_cena.id_cliente
        LEFT JOIN
            vetado v ON cliente.id_cliente = v.id_cliente
        LEFT JOIN
            (SELECT id_cliente, ABS(SUM(monto_t)) AS total
            FROM pago
            GROUP BY id_cliente) AS total_deuda ON cliente.id_cliente = total_deuda.id_cliente
        WHERE
            v.id_cliente IS NOT NULL
    
        `;

        let params = [];

        // Verificar si se proporcionaron fechas como parámetros
        if (startDate && endDate) {
            query = `
                SELECT *,
                    CASE
                        WHEN fecha_i IS NULL THEN (SELECT MAX(fecha_u) FROM servcliente WHERE id_cliente = allvetados.id_cliente)
                        ELSE fecha_i
                    END AS fecha_i,
                    fecha_s
                FROM (${query}) AS allvetados
                WHERE (fecha_i >= $1 AND fecha_i <= $2 AND (fecha_s IS NULL OR (fecha_s >= $1 AND fecha_s <= $2 OR fecha_s = $2))) 
                ORDER BY allvetados.fecha_i ASC, allvetados.fecha_s ASC`;
            params = [startDate, endDate];
        }

        const vetados = await db.any(query, params);
        return vetados;
    } catch (error) {
        throw error;
    }
}

const getAllIngresos = async (startDate, endDate) => {
    try {
        let query = `
            SELECT 
                MIN(fecha_p) AS fecha_inicio,
                MAX(fecha_p) AS fecha_fin,
                ABS(SUM(CASE WHEN notas_p <> 'Pago (Condonado)' THEN monto_t ELSE 0 END)) AS total_pagado,
                ABS(SUM(CASE WHEN notas_p = 'Pago (Condonado)' THEN monto_t ELSE 0 END)) AS total_condonado,
                ABS(SUM(CASE WHEN notas_p <> 'Pago (Condonado)' THEN monto_t ELSE 0 END)) - ABS(SUM(CASE WHEN notas_p = 'Pago (Condonado)' THEN monto_t ELSE 0 END)) AS ingresos_reales 
            FROM 
                pago`;

        const params = [];
        
        // Verificar si startDate y endDate están definidos
        if (startDate && endDate) {
            query += ` WHERE fecha_p BETWEEN $1 AND $2`;
            params.push(startDate, endDate);
        }

        const result = await db.one(query, params);
        return result;
    } catch (error) {
        throw error;
    }
}




module.exports = { getAllUsers,getAllHuespedes,getUserInfo, getAllVisitantes, getAllVetados, getAllGeneralHuespedes, getAllGeneralVisitantes, getAllGeneralVetados, getAllIngresos}
