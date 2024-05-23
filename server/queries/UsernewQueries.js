const db = require('../db_connection'); // Import the database connection

//Función para obtener ids de cama libres
const getAllDispBeds = async() => {
    try {
        const beds = await db.any(
            `SELECT cama.id_cama, cama.id_zona
            FROM cama
            LEFT JOIN huesped ON cama.id_cama = huesped.id_cama
            WHERE huesped.id_cama IS NULL
            ORDER BY cama.id_cama`)
        return beds
    } catch (error) {
        throw error
    }
}

const registerNewPatient = async (id_usuario, carnet, id_area, nombre_p, apellidos_p, nombre_c, apellidos_c, lugar_o, notas_c, sexo, nivel_se, id_cama, paciente, checked) => {
    try {
        console.log("Registrando nuevo paciente:", id_usuario, carnet, id_area, nombre_p, apellidos_p, nombre_c, apellidos_c, lugar_o, notas_c, sexo, nivel_se, id_cama, paciente, checked);
        await db.none(
            `
            BEGIN TRANSACTION;
            
                INSERT INTO paciente (carnet, id_area, nombre_p, apellidos_p)
                VALUES ($1, $2, $3, $4);
                    

                INSERT INTO cliente (id_usuario, carnet, nombre_c, apellidos_c, lugar_o, notas_c, sexo, nivel_se, paciente, checked)
                VALUES ( $13, $1, $5, $6, $7, $8, $9, $10, $12, $14);

                DO $$
                DECLARE
                    ultimo_cliente VARCHAR(30);
                BEGIN
                    SELECT id_cliente INTO ultimo_cliente FROM cliente ORDER BY id_cliente DESC LIMIT 1;

                INSERT INTO huesped (id_cliente, id_cama, fecha_i, fecha_s)
                VALUES (CAST(ultimo_cliente AS INTEGER), $11, CURRENT_TIMESTAMP, NULL);

                CALL genServCliente_procHuesped(CAST (ultimo_cliente AS INTEGER), ARRAY[[1, 1], [2, 1], [3, 1],[4, 1], [5, 1]]);
                INSERT INTO pago (id_cliente, notas_p, monto_t, fecha_p)
                VALUES (CAST(ultimo_cliente AS INTEGER), 'primer dia', -20, CURRENT_TIMESTAMP);
                END $$;
                COMMIT;
            `,
            [carnet, id_area, nombre_p, apellidos_p, nombre_c, apellidos_c, lugar_o, notas_c, sexo, nivel_se, id_cama, paciente, id_usuario, checked],
            console.log("LISTO 1 X)")
        );
    } catch (error) {
        throw error;
    }
}


const registerEntradaUnica = async (id_usuario, carnet, id_area, nombre_p, apellidos_p, nombre_c, apellidos_c, lugar_o, notas_c, sexo, nivel_se, shower, bathroom, breakfast, meal, dinner, paciente, checked, cantidad, costo) => {
    try {
        console.log("Registrando nuevo paciente:", carnet, id_area, nombre_p, apellidos_p, nombre_c, apellidos_c, lugar_o, notas_c, sexo, nivel_se, shower, bathroom, breakfast, meal, dinner, paciente, checked, cantidad, costo);
        await db.none(
            `
            BEGIN TRANSACTION;
                INSERT INTO paciente (carnet, id_area, nombre_p, apellidos_p)
                VALUES ($1, $2, $3, $4);
                    
                INSERT INTO cliente (id_usuario, carnet, nombre_c, apellidos_c, lugar_o, notas_c, sexo, nivel_se, paciente, checked)
                VALUES ($17, $1, $5, $6, $7, $8, $9, $10, $16, $18);

                DO $$
                DECLARE
                    ultimo_cliente VARCHAR(30);
                BEGIN
                    SELECT id_cliente INTO ultimo_cliente FROM cliente ORDER BY id_cliente DESC LIMIT 1;

                    -- Llamar al procedimiento almacenado CrearServiciosCliente
                    CALL genServCliente_proc(CAST (ultimo_cliente AS INTEGER), ARRAY[[1, $11], [2, $12], [3, $13],[4, $14], [5, $15]]);
                    INSERT INTO pago (id_cliente, notas_p, monto_t, fecha_p)
                    VALUES (CAST(ultimo_cliente AS INTEGER), 'Cantidad total de servicio Entrada Única: $19', $20, CURRENT_TIMESTAMP);
                END $$;
                COMMIT;
            `,
            [carnet, id_area, nombre_p, apellidos_p, nombre_c, apellidos_c, lugar_o, notas_c, sexo, nivel_se, shower, bathroom, breakfast, meal, dinner, paciente, id_usuario, checked, cantidad, costo],
            console.log("LISTO 2 ;()")
        );
    } catch (error) {
        throw error;
    }
}

//FUNCION PARA ACTUALIZAR INFO DEL PACIENTE
const updateInfocliente = async (id_usuario, carnet, id_area, nombre_p, apellidos_p, nombre_c, apellidos_c, lugar_o, notas_c, sexo, nivel_se, id_cama, paciente, checked, id_cliente) => {
    try {
        console.log("Registrando nuevo paciente:", id_usuario, carnet, id_area, nombre_p, apellidos_p, nombre_c, apellidos_c, lugar_o, notas_c, sexo, nivel_se, id_cama, paciente, checked, id_cliente);
        await db.none(
            `

                UPDATE huesped SET id_cama = $11 Where id_cliente= $15;

                UPDATE paciente SET carnet = $1,id_area = $2, nombre_p = $3, apellidos_p = $4
                 WHERE carnet IN ( SELECT carnet FROM cliente WHERE id_cliente = $15);

                UPDATE cliente SET id_usuario = $13, carnet = $1, nombre_c = $5, apellidos_c = $6, 
                lugar_o = $7, notas_c = $8, sexo = $9, nivel_se = $10, paciente = $12,checked = $14
                WHERE id_cliente = $15;

            `,
            [carnet, id_area, nombre_p, apellidos_p, nombre_c, apellidos_c, lugar_o, notas_c, sexo, nivel_se, id_cama, paciente, id_usuario, checked, id_cliente],
            console.log("LISTO 1 X)")
        );
    } catch (error) {
        throw error;
    }
}


//Función para obtener todas las areas del HNP
const getAllAreas = async() => {
    try {
        const areas = await db.any(
            `SELECT *
            FROM area`)
        return areas
    } catch (error) {
        throw error
    }
}

//Función para obtener la información de un usuario previamente registrado
const getAllClientInfo = async(nombre_c, apellidos_c) => {
    console.log(nombre_c)
    console.log(apellidos_c)
    try {
        const client = await db.any(`SELECT cliente.sexo, cliente.nivel_se, cliente.lugar_o, paciente.nombre_p, paciente.apellidos_p,
            cliente.carnet, paciente.id_area, cliente.notas_c FROM cliente LEFT JOIN paciente ON cliente.carnet = paciente.carnet
            WHERE nombre_c = $1 AND apellidos_c = $2`, [nombre_c, apellidos_c])
        return client
    } catch (error) {
        throw error
    }
}
//Función para saber si el carnet ya existe
const getcarnet = async(carnet) => {
    try {
        const carnetExist = await db.any(`SELECT CASE WHEN EXISTS (
            SELECT 1 FROM paciente WHERE carnet = $1
        ) THEN 'true' ELSE 'false' END AS carnetExist;;`, [carnet])
        return carnetExist
    } catch (error) {
        throw error
    }
}

module.exports = {getAllDispBeds, getAllAreas, getAllClientInfo, registerNewPatient, registerEntradaUnica, getcarnet, updateInfocliente}
