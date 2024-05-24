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
//Función para obtener ids de cama libres
const getlDispBeds = async(id_cama) => {
    try {
        const beds2 = await db.any(
            `SELECT id_zona FROM cama WHERE id_cama =$1;`, [id_cama])
        return beds2[0]
    } catch (error) {
        throw error
    }
}
const registerNewPatient = async (id_usuario, carnet, id_area, nombre_p, apellidos_p, nombre_c, apellidos_c, lugar_o, notas_c, sexo, nivel_se, id_cama, paciente, checked) => {
    try {
        console.log("Registrando nuevo paciente:", id_usuario, carnet, id_area, nombre_p, apellidos_p, nombre_c, apellidos_c, lugar_o, notas_c, sexo, nivel_se, id_cama, paciente, checked);
        await db.none(
            `
            DO $$
            DECLARE
                id_toBe INT = 0;
            BEGIN
                BEGIN 
                    INSERT INTO paciente(carnet, id_area, nombre_p, apellidos_p)
                    VALUES ($1, $2, $3, $4)
                    ON CONFLICT (carnet) DO UPDATE
                    SET id_area = EXCLUDED.id_area;
                    
                    INSERT INTO cliente(id_usuario, carnet, nombre_c, apellidos_c, lugar_o, notas_c, sexo, nivel_se, paciente, checked)
                    VALUES ($5, $1, $6, $7, $8, $9, $10, $11, $12, $13)
                    ON CONFLICT (nombre_c, apellidos_c, lugar_o) DO UPDATE
                    SET (id_usuario, carnet, notas_c, nivel_se, paciente, checked) =
                    (EXCLUDED.id_usuario, EXCLUDED.carnet, EXCLUDED.notas_c, EXCLUDED.nivel_se, EXCLUDED.paciente, EXCLUDED.checked);
                    
                    SELECT id_cliente INTO id_toBe FROM cliente WHERE nombre_c = $6
                        AND apellidos_c = $7
                        AND lugar_o = $8;
                    RAISE NOTICE 'ID %', id_toBe;
                    
                    CALL genServCliente_procHuesped(id_toBe, ARRAY[[1, 1], [2, 1], [3, 1],[4, 1], [5, 1]]);
                    INSERT INTO pago(id_cliente, notas_p, monto_t, fecha_p)
                    VALUES (id_toBe, 'primer dia', -20, CURRENT_TIMESTAMP);
                    
                    INSERT INTO huesped(id_cliente, id_cama, fecha_i, fecha_s)
                    VALUES (id_toBe, $14, CURRENT_TIMESTAMP, NULL)
                    ON CONFLICT (id_cliente) DO NOTHING;
                    IF NOT FOUND
                        THEN RAISE NOTICE 'HUESPED ACTIVO';
                        ROLLBACK;
                        RETURN;
                    END IF;
                    
                    CASE
                        WHEN EXISTS (SELECT 1 FROM vetado WHERE id_cliente = id_toBe)
                            THEN BEGIN
                                RAISE NOTICE 'CLIENTE VETADO';
                                ROLLBACK;
                                RETURN;
                            END;
                            ELSE
                                RAISE NOTICE 'CLIENTE NO VETADO';
                    END CASE;
                    
                    CASE
                        WHEN EXISTS (SELECT 1 FROM paciente WHERE carnet = $1
                            AND nombre_p = $3
                            AND apellidos_p = $4)
                            THEN RAISE NOTICE 'PACIENTE COINCIDE';
                            ELSE BEGIN
                                RAISE NOTICE 'PACIENTE NO COINCIDE';
                                ROLLBACK;
                                RETURN;
                            END;
                    END CASE;
                END;
            END $$
            `,
            [carnet, id_area, nombre_p, apellidos_p, id_usuario, nombre_c, apellidos_c, lugar_o, notas_c, sexo, nivel_se, paciente, checked, id_cama],
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
            DO $$
            DECLARE
                id_toBe INT = 0;
            BEGIN
                BEGIN 
                    INSERT INTO paciente(carnet, id_area, nombre_p, apellidos_p)
                    VALUES ($1, $2, $3, $4)
                    ON CONFLICT (carnet) DO UPDATE
                    SET id_area = EXCLUDED.id_area;
                    
                    INSERT INTO cliente(id_usuario, carnet, nombre_c, apellidos_c, lugar_o, notas_c, sexo, nivel_se, paciente, checked)
                    VALUES ($5, $1, $6, $7, $8, $9, $10, $11, $12, $13)
                    ON CONFLICT (nombre_c, apellidos_c, lugar_o) DO UPDATE
                    SET (id_usuario, carnet, notas_c, nivel_se, paciente, checked) =
                    (EXCLUDED.id_usuario, EXCLUDED.carnet, EXCLUDED.notas_c, EXCLUDED.nivel_se, EXCLUDED.paciente, EXCLUDED.checked);
                    
                    SELECT id_cliente INTO id_toBe FROM cliente WHERE nombre_c = $6
                        AND apellidos_c = $7
                        AND lugar_o = $8;
                    RAISE NOTICE 'ID %', id_toBe;
                    
                    CALL genServCliente_proc(id_toBe, ARRAY[[1, $14], [2, $15], [3, $16],[4, $17], [5, $18]]);
                    INSERT INTO pago(id_cliente, notas_p, monto_t, fecha_p)
                    VALUES (id_toBe, 'Cantidad total de servicio Entrada Única: $19', $20, CURRENT_TIMESTAMP);

                    CASE
                        WHEN EXISTS (SELECT 1 FROM huesped WHERE id_cliente = id_toBe)
                            THEN BEGIN
                                RAISE NOTICE 'HUESPED ACTIVO';
                                ROLLBACK;
                                RETURN;
                            END;
                            ELSE
                                RAISE NOTICE 'NO ES HUESPED ACTIVO';
                    END CASE;
                    
                    CASE
                        WHEN EXISTS (SELECT 1 FROM vetado WHERE id_cliente = id_toBe)
                            THEN BEGIN
                                RAISE NOTICE 'CLIENTE VETADO';
                                ROLLBACK;
                                RETURN;
                            END;
                            ELSE
                                RAISE NOTICE 'CLIENTE NO VETADO';
                    END CASE;
                    
                    CASE
                        WHEN EXISTS (SELECT 1 FROM paciente WHERE carnet = $1
                            AND nombre_p = $3
                            AND apellidos_p = $4)
                            THEN RAISE NOTICE 'PACIENTE COINCIDE';
                            ELSE BEGIN
                                RAISE NOTICE 'PACIENTE NO COINCIDE';
                                ROLLBACK;
                                RETURN;
                            END;
                    END CASE;
                END;
            END $$
            `,
            [carnet, id_area, nombre_p, apellidos_p, id_usuario, nombre_c, apellidos_c, lugar_o, notas_c, sexo, nivel_se, paciente, checked, shower, bathroom, breakfast, meal, dinner, cantidad, costo],
            console.log("LISTO 2 ;()")
        );
    } catch (error) {
        throw error;
    }
}

//FUNCION PARA ACTUALIZAR INFO DEL PACIENTE
const updateInfocliente = async (id_usuario, carnet, id_area, nombre_p, apellidos_p, nombre_c, apellidos_c, lugar_o, notas_c, sexo, nivel_se, id_cama, paciente, id_cliente) => {
    try {
        console.log("Actualizando huesped:", id_usuario, carnet, id_area, nombre_p, apellidos_p, nombre_c, apellidos_c, lugar_o, notas_c, sexo, nivel_se, id_cama, paciente, id_cliente);
        await db.none(
            `

                UPDATE huesped SET id_cama = $11 Where id_cliente= $14;

                UPDATE paciente SET carnet = $1,id_area = $2, nombre_p = $3, apellidos_p = $4
                 WHERE carnet IN ( SELECT carnet FROM cliente WHERE id_cliente = $14);

                UPDATE cliente SET id_usuario = $13, carnet = $1, nombre_c = $5, apellidos_c = $6, 
                lugar_o = $7, notas_c = $8, sexo = $9, nivel_se = $10, paciente = $12, checked = true
                WHERE id_cliente = $14;

            `,
            [carnet, id_area, nombre_p, apellidos_p, nombre_c, apellidos_c, lugar_o, notas_c, sexo, nivel_se, id_cama, paciente, id_usuario, id_cliente],
            console.log("LISTO 1 X)")
        );
    } catch (error) {
        throw error;
    }
}
//FUNCION PARA ACTUALIZAR INFO DEL PACIENTE tipo entrada unica
const updateInfoentrada = async (id_usuario, carnet, id_area, nombre_p, apellidos_p, nombre_c, apellidos_c, lugar_o, notas_c, sexo, nivel_se, paciente, id_cliente) => {
    try {
        console.log("Actualizando entrada unica:", id_usuario, carnet, id_area, nombre_p, apellidos_p, nombre_c, apellidos_c, lugar_o, notas_c, sexo, nivel_se, paciente, id_cliente);
        await db.none(
            `

                UPDATE paciente SET carnet = $1,id_area = $2, nombre_p = $3, apellidos_p = $4
                 WHERE carnet IN ( SELECT carnet FROM cliente WHERE id_cliente = $13);

                UPDATE cliente SET id_usuario = $12, carnet = $1, nombre_c = $5, apellidos_c = $6, 
                lugar_o = $7, notas_c = $8, sexo = $9, nivel_se = $10, paciente = $11,checked = true
                WHERE id_cliente = $13;

            `,
            [carnet, id_area, nombre_p, apellidos_p, nombre_c, apellidos_c, lugar_o, notas_c, sexo, nivel_se, paciente, id_usuario, id_cliente],
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
//Función para saber si el carnet ya existe
const getcarnetEdit = async(carnet, id_cliente) => {
    try {
        const carnetExist = await db.any(`SELECT 
        CASE 
            WHEN EXISTS (SELECT 1 FROM paciente WHERE carnet = $1) THEN 
                CASE 
                    WHEN (SELECT id_cliente FROM cliente WHERE id_cliente = $2) = $2 THEN 'false'
                    ELSE 'true'
                END
            ELSE 'false'
        END AS carnetExist;`, [carnet, id_cliente])
        return carnetExist
    } catch (error) {
        throw error
    }
}

module.exports = {getAllDispBeds, getAllAreas, getAllClientInfo, registerNewPatient, registerEntradaUnica, getcarnet, updateInfocliente, updateInfoentrada, getcarnetEdit, getlDispBeds}
