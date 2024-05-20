const db = require('../db_connection');

//Función para vetar
const banClient = async(id_usuario, id_cliente, notas_v) => {
    try {
        const ban = await db.none(
            `CALL veto_proc($1, $2, $3)`, [id_usuario, id_cliente, notas_v]
        )
        return ban
    } catch (error) {
        throw error
    }
}

const unbanClient = async(id_cliente) => {
    try {
        const unban = await db.none(
            `DELETE FROM vetado
            WHERE id_cliente = $1`, [id_cliente]
        )
        return unban
    } catch (error) {
        throw error
    }
}

const deleteClient = async(id_cliente) => {
    try {
        // console.log('DELETE ', id_cliente)
        const delet = await db.none(
            `DELETE FROM cliente
            WHERE id_cliente = $1`, [id_cliente]
        )
        return delet
    } catch (error) {
        throw error
    }
}

// Function to get all clients
const getAllClients = async () => {
    try {
        const clients = await db.any(
            `SELECT DISTINCT cliente.id_cliente, usuario.nombre_u, cliente.nombre_c, cliente.apellidos_c, servcliente.tipo_cliente, cliente.lugar_o, cliente.carnet, cliente.nivel_se, total,
            CASE WHEN vetado.id_cliente IS NOT NULL THEN TRUE ELSE FALSE END AS Vetado
            FROM cliente
            LEFT JOIN usuario ON cliente.id_usuario = usuario.id_usuario
            LEFT JOIN servcliente ON cliente.id_cliente = servcliente.id_cliente
            LEFT JOIN vetado ON cliente.id_cliente = vetado.id_cliente
            LEFT JOIN absolutedeudas ON cliente.id_cliente = absolutedeudas.id_cliente
            ORDER BY total DESC`)
        return clients
    } catch (error) {
        throw error
    }
}

//Función para filtrado -- AVANCE 
const filterColumnDB = [
    {id: 1, column: 'cliente.sexo', valdb: true},
    {id: 2, column: 'cliente.sexo', valdb: false},
    {id: 3, column: 'cliente.id_cliente', valdb: 'vetado.id_cliente'},
    {id: 4, column: 'vetado.id_cliente'},
    {id: 5, column: 'absoluteDeudas.total', valdb: 0},
    {id: 6, column: 'cliente.checked', valdb: false},
]

// CHECAR REGLAS DE FILTRO
const genWhereClause = (select_Filters, select_View, debtRange, dateRange) => {
    let i = [0,0,0]
    let filterConditions = ''
    let filterDebt = ''
    let filterDate = ''
    if (select_Filters.length !== 0 || debtRange.length !== 0 || dateRange.length !== 0) {
        const init = 'WHERE '
        if (select_Filters.length !== 0) {
            i[0] = 1
            filterConditions = select_Filters.map((filter) => {
                if (filter == 1 || filter == 2 || filter == 3 || filter == 6) {
                    return `${filterColumnDB[filter - 1].column} = ${filterColumnDB[filter - 1].valdb}`
                }
                else if (filter == 4) {
                    return `${filterColumnDB[filter - 1].column} IS NULL`
                }
                else if (filter == 5) {
                    return `${filterColumnDB[filter - 1].column} > ${filterColumnDB[filter - 1].valdb}`
                }
            }).join(' AND ')
            console.log('filterquery: ', filterConditions)
        }
        if (debtRange.length !== 0) {
            i[1] = 1
            filterDebt = `total BETWEEN ${debtRange[0]} AND ${debtRange[1]}`
            console.log('debtquery: ', filterDebt)
        }
        if (dateRange.length !== 0) {
            i[2] = 1
            if (select_View == 10 || select_View == 7) {
                filterDate = `fecha_i BETWEEN '${dateRange[0]}' AND '${dateRange[1]}'`
            }
            else if (select_View == 8) {
                filterDate = `fecha_i >= '${dateRange[0]}' AND fecha_s <= '${dateRange[1]}'`
            }
            else {
                filterDate = `fecha_u BETWEEN '${dateRange[0]}' AND '${dateRange[1]}'`
            }
            console.log('datequery: ', filterDate)
        }

        if (i[0] == 1 && i[1] == 1 && i[2] == 1) {
            return init + filterConditions + ' AND ' + filterDebt + ' AND ' + filterDate
        }
        else if ((i[0] == 1 && i[1] == 1) || (i[0] == 1 && i[2] == 1)) {
            return init + filterConditions + ' AND ' + filterDebt + filterDate
        }
        else if (i[1] == 1 && i[2] == 1) {
            return init + filterDebt + ' AND ' + filterDate
        }
        return init + filterConditions + filterDebt + filterDate
    }
    else {
        const init = ""
        return init
    }
}

const getClientsByFilter = async (select_Filters, select_View, debtRange, dateRange) => {
    try {
        const whereClause = genWhereClause(select_Filters, select_View, debtRange, dateRange)
        console.log(whereClause)
        if (select_View == 10) {
            console.log('ENTRA1')
            const clients = await db.any('SELECT * FROM getClientsByFilterGeneral_func($1)', [whereClause])
            console.log('LO HIZO')
            console.log(clients)
            return clients
        }
        else if (select_View == 7) {
            const clients = await db.any('SELECT * FROM getClientsByFilterHuesped_func($1)', [whereClause])
            return clients
        }
        else if (select_View == 8) {
            const clients = await db.any('SELECT * FROM getClientsByFilterVisitaPrevia_func($1)', [whereClause])
            return clients
        }
        else if (select_View == 9) {
            const clients = await db.any('SELECT * FROM getClientsByFilterServicios_func($1)', [whereClause])
            return clients
        }
    } catch (error) {
        throw error
    }
}

module.exports = {getAllClients, getClientsByFilter, banClient, unbanClient, deleteClient}
