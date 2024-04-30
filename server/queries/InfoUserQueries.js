const db = require('../db_connection'); // Import the database connection


//Función para obtener la información de un usuario previamente registrado
const getclienteInfoD = async(id_cliente) => {
    try {
        const clientInfo = await db.any(`SELECT cliente.*, paciente.*, area.nombre_a, servcliente.tipo_cliente
        FROM cliente, paciente, area, servcliente
        WHERE cliente.id_cliente = $1 
          AND cliente.carnet = paciente.carnet
          AND cliente.id_cliente = servcliente.id_cliente
          AND paciente.id_area = area.id_area;`, [id_cliente])
        return clientInfo[0]
    } catch (error) {
        throw error
    }
}

//Función para obtener la información de un cliente tipo Huesped
const getHuespedInfo = async(id_cliente) => {
    try {
        const huespednfo = await db.any(`SELECT fecha_i, id_cama, fecha_s  FROM huesped WHERE id_cliente = $1;`, [id_cliente])
        return huespednfo[0]
    } catch (error) {
        throw error
    }
}
//Función para obtener la información de un cliente tipo Huesped
const getDeudaCliente = async(id_cliente) => {
    try {
        const deudaCliente = await db.any(`SELECT calcular_deuda_cliente($1) AS DeudaCliente;`, [id_cliente])
        return deudaCliente[0]
    } catch (error) {
        throw error
    }
}

//Función para obtener la cantidad de servicios del tipo entrada Unica

const getServicioEU = async(id_cliente) => {
    try {
        const servicioEU = await db.any(`SELECT * FROM calcular_suma_servicios_por_tipo($1);`, [id_cliente])
        return servicioEU[0]
    } catch (error) {
        throw error
    }
}

module.exports={getHuespedInfo, getclienteInfoD, getDeudaCliente, getServicioEU}