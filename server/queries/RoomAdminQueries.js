const db = require('../db_connection');

// Querie que obtiene toda la info de camasgralinfo, para cada zona.
// (Ver Función RoomAdmin en RoomAdmin.jsx)
const getInfo = async() => {
    try { 
        const infoMujeres = await db.any(
            `SELECT * FROM camasgralinfo WHERE id_zona = 1`, [])
        
        const infoHombres = await db.any(
            `SELECT * FROM camasgralinfo WHERE id_zona = 2`, [])
        
        const infoAislados = await db.any(
            `SELECT * FROM camasgralinfo WHERE id_zona = 3`, [])
        
        const info = [infoMujeres, infoHombres, infoAislados]

        return info

    } catch (error) {
        throw error
    }
}


// Querie para Añadir una Cama
const anadCama = async(id_zona) => {
    try {
        await db.none(
            `INSERT INTO cama (id_zona)
            VALUES ($1)`, [id_zona])
        
    } catch (error) {
        throw error
    }
}    


// Querie para Registrar un Servicio
const regServacio = async(id_cliente, id_servicio, cant) => {
    try {
        db.none(
            `INSERT INTO servcliente (id_cliente, id_servicio, cant, fecha_U, tipo_cliente)
            VALUES ($1, $2, $3, NOW(), true)
            `, [id_cliente, id_servicio, cant])
    } catch (error) {
        throw error
    }
}


// Querie para Pagar
const regPago = async(id_cliente, notas_P, monto_T) => {
    try {
        db.none(
            `INSERT INTO Pago (id_Cliente, notas_P, monto_T, fecha_P)
            VALUES ($1, $2, $3, NOW())
            `, [id_cliente, notas_P, monto_T])
        
    } catch (error) {
        throw error
    }
}


// Querie para Registrar la Salida de un Huésped
const regSalida = async(id_cliente) => {
    try {
        db.none(
            `UPDATE huesped
            SET fecha_S = NOW()
            WHERE id_Cliente = $1`,[id_cliente])
        
    } catch (error) {
        throw error
    }
}


// Querie para Eliminar una Cama
const eliminarCama = async(id_cama) => {
    try {
        db.none(
            `DELETE FROM Cama
            WHERE id_Cama = $1;
            `,[id_cama])
        
    } catch (error) {
        throw error
    }
}


module.exports = { getInfo, regServacio, regPago, regSalida, eliminarCama, anadCama }