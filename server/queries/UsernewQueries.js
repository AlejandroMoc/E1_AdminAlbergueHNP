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

module.exports = { getAllDispBeds, getAllAreas, getAllClientInfo }
