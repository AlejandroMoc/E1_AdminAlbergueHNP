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

const registerNewPatient = async (carnet, id_area, nombre_p, apellidos_p, nombre_c, apellidos_c, lugar_o, notas_c, sexo, nivel_se, id_cama) => {
    try {
        console.log("Registrando nuevo paciente:", carnet, id_area, nombre_p, apellidos_p, nombre_c, apellidos_c, lugar_o, notas_c, sexo, nivel_se, id_cama);
        await db.none(
            `
            BEGIN TRANSACTION;
            
                INSERT INTO paciente (carnet, id_area, nombre_p, apellidos_p)
                VALUES ($1, $2, $3, $4);
                    

                INSERT INTO cliente (id_usuario, carnet, nombre_c, apellidos_c, lugar_o, notas_c, sexo, nivel_se)
                VALUES ( 1, $1, $5, $6, $7, $8, $9, $10);

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
            [carnet, id_area, nombre_p, apellidos_p, nombre_c, apellidos_c, lugar_o, notas_c, sexo, nivel_se, id_cama],
            console.log("LISTO 1 :)")
        );
    } catch (error) {
        throw error;
    }
}


const registerEntradaUnica = async (carnet, id_area, nombre_p, apellidos_p, nombre_c, apellidos_c, lugar_o, notas_c, sexo, nivel_se, shower, bathroom, breakfast, meal, dinner) => {
    try {
        console.log("Registrando nuevo paciente:", carnet, id_area, nombre_p, apellidos_p, nombre_c, apellidos_c, lugar_o, notas_c, sexo, nivel_se);
        await db.none(
            `
            BEGIN TRANSACTION;
                INSERT INTO paciente (carnet, id_area, nombre_p, apellidos_p)
                VALUES ($1, $2, $3, $4);
                    

                INSERT INTO cliente (id_usuario, carnet, nombre_c, apellidos_c, lugar_o, notas_c, sexo, nivel_se)
                VALUES ( 1, $1, $5, $6, $7, $8, $9, $10);


                DO $$
                DECLARE
                    ultimo_cliente VARCHAR(30);
                BEGIN
                    SELECT id_cliente INTO ultimo_cliente FROM cliente ORDER BY id_cliente DESC LIMIT 1;

                    -- Llamar al procedimiento almacenado CrearServiciosCliente
                    CALL genServCliente_proc(CAST (ultimo_cliente AS INTEGER), ARRAY[[1, $11], [2, $12], [3, $13],[4, $14], [5, $15]]);
                    
                    
                END $$;
                COMMIT;
            `,
            [carnet, id_area, nombre_p, apellidos_p, nombre_c, apellidos_c, lugar_o, notas_c, sexo, nivel_se, shower, bathroom, breakfast, meal, dinner],
            console.log("LISTO 2 :)")
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

module.exports = { getAllDispBeds, getAllAreas, getAllClientInfo, registerNewPatient, registerEntradaUnica}
