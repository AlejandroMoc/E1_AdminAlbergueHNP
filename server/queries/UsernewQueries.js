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
        //console.log("Registrando nuevo paciente:", id_usuario, carnet, id_area, nombre_p, apellidos_p, nombre_c, apellidos_c, lugar_o, notas_c, sexo, nivel_se, id_cama, paciente, checked);
        const pacienteR = await db.one(
            `
            SELECT registerHuesped_func($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14);
            `,
            [carnet, id_area, nombre_p, apellidos_p, id_usuario, nombre_c, apellidos_c, lugar_o, notas_c, sexo, nivel_se, paciente, checked, id_cama],
            //console.log("LISTO 1 X)")
        );
        return pacienteR
    } catch (error) {
        throw error;
    }
}

const registerEntradaUnica = async (id_usuario, carnet, id_area, nombre_p, apellidos_p, nombre_c, apellidos_c, lugar_o, notas_c, sexo, nivel_se, shower, bathroom, breakfast, meal, dinner, paciente, checked, cantidad, costo) => {
    try {
        //console.log("Registrando nuevo paciente:", carnet, id_area, nombre_p, apellidos_p, nombre_c, apellidos_c, lugar_o, notas_c, sexo, nivel_se, shower, bathroom, breakfast, meal, dinner, paciente, checked, cantidad, costo);
        const pacienteU = await db.one(
            `
            SELECT registerVisitante_func($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20);
            `,
            [carnet, id_area, nombre_p, apellidos_p, id_usuario, nombre_c, apellidos_c, lugar_o, notas_c, sexo, nivel_se, paciente, checked, shower, bathroom, breakfast, meal, dinner, cantidad, costo],
            //console.log("LISTO 2 ;()")
        );
        return pacienteU
    } catch (error) {
        throw error;
    }
}

const updateInfocliente = async (id_usuario, carnet, id_area, nombre_p, apellidos_p, nombre_c, apellidos_c, lugar_o, notas_c, sexo, nivel_se, id_cama, paciente, id_cliente) => {
    try {
        //console.log("Actualizando huesped:", id_usuario, carnet, id_area, nombre_p, apellidos_p, nombre_c, apellidos_c, lugar_o, notas_c, sexo, nivel_se, id_cama, paciente, id_cliente);
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
            //console.log("LISTO 1 X)")
        );
    } catch (error) {
        throw error;
    }
}
//FUNCION PARA ACTUALIZAR INFO DEL PACIENTE tipo entrada unica
const updateInfoentrada = async (id_usuario, carnet, id_area, nombre_p, apellidos_p, nombre_c, apellidos_c, lugar_o, notas_c, sexo, nivel_se, paciente, id_cliente) => {
    try {
        //console.log("Actualizando entrada unica:", id_usuario, carnet, id_area, nombre_p, apellidos_p, nombre_c, apellidos_c, lugar_o, notas_c, sexo, nivel_se, paciente, id_cliente);
        await db.none(
            `

                UPDATE paciente SET carnet = $1,id_area = $2, nombre_p = $3, apellidos_p = $4
                 WHERE carnet IN ( SELECT carnet FROM cliente WHERE id_cliente = $13);

                UPDATE cliente SET id_usuario = $12, carnet = $1, nombre_c = $5, apellidos_c = $6, 
                lugar_o = $7, notas_c = $8, sexo = $9, nivel_se = $10, paciente = $11,checked = true
                WHERE id_cliente = $13;

            `,
            [carnet, id_area, nombre_p, apellidos_p, nombre_c, apellidos_c, lugar_o, notas_c, sexo, nivel_se, paciente, id_usuario, id_cliente],
            //console.log("LISTO 1 X)")
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
    //console.log(nombre_c)
    //console.log(apellidos_c)
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
                    WHEN (SELECT carnet FROM cliente WHERE id_cliente = $2) = $1 THEN 'false'
                    ELSE 'true'
                END
            ELSE 'false'
        END AS carnetExist;`, [carnet, id_cliente])
        return carnetExist
    } catch (error) {
        throw error
    }
}

module.exports = {getAllDispBeds, getAllAreas, getAllClientInfo, registerNewPatient, registerEntradaUnica, getcarnet, updateInfocliente, updateInfoentrada, getcarnetEdit}
