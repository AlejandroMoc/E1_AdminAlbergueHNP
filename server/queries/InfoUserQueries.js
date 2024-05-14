const db = require('../db_connection');


//Función para obtener la información de un usuario previamente registrado
const getclienteInfoD = async(id_cliente) => {
    try {
        const clientInfo = await db.any(`SELECT cliente.*, paciente.*, area.nombre_a
        FROM cliente, paciente, area
        WHERE cliente.id_cliente = $1 
          AND cliente.carnet = paciente.carnet
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
//Función para agregar un nuevo pago

//Función para obtener ids de cama libres

const getNewRegister = async(id_cliente, pago) => {
    try {
        console.log("Registrando nuevo pago:",id_cliente, pago);
        await db.none(
            `INSERT INTO pago (id_cliente, notas_p, monto_t, fecha_p) 
            VALUES ($1, 'Agregado desde InfoUser', $2, CURRENT_TIMESTAMP);
            `,
            [id_cliente, pago],
            console.log("LISTO 2 :)")
        );
    } catch (error) {
        throw error;
    }
}

//Función para obtener el tipo de cliente
const getTipoCliente = async(id_cliente) => {
    try {
        const clientInfo = await db.any(`SELECT tipo_cliente
        FROM servcliente
        WHERE id_cliente = $1;`, [id_cliente])
        return clientInfo[0]
    } catch (error) {
        throw error
    }
}
//Función para obtener el tipo de cliente
const getVetado = async(id_cliente) => {
    try {
        const clientVeto = await db.any(`SELECT CASE WHEN EXISTS (
            SELECT 1 FROM vetado WHERE id_cliente = $1
        ) THEN 'true' ELSE 'false' END AS vetadoBool;;`, [id_cliente])
        return clientVeto[0]
    } catch (error) {
        throw error
    }
}
//Función para obtener La razon del veto
const getNotaVeto = async(id_cliente) => {
    try {
        const vetadoInfo = await db.any(`SELECT notas_v
        FROM vetado
        WHERE id_cliente = $1;`, [id_cliente])
        return vetadoInfo[0]
    } catch (error) {
        throw error
    }
}



module.exports={getHuespedInfo, getclienteInfoD, getDeudaCliente, getServicioEU, getNewRegister, getTipoCliente, getVetado, getNotaVeto}