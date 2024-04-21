const db = require('../db_connection'); // Import the database connection

// Function to get all clients
const getAllClients = async () => {
    try {
        const clients = await db.any(`SELECT DISTINCT cliente.id_cliente, id_cama, nombre_c, apellidos_c, fecha_i, lugar_o, nombre_p, apellidos_p, cliente.carnet, nivel_se
                                        FROM cliente 
                                        LEFT JOIN huesped ON cliente.id_cliente = huesped.id_cliente
                                        LEFT JOIN paciente ON cliente.carnet = paciente.carnet
                                        ORDER BY id_cama`)
        return clients
    } catch (error) {
        throw error
    }
}

//Función para filtrado -- AVANCE 
const filterColumnDB = [
    {id: 1, column: 'cliente.sexo', valdb: true},
    {id: 2, column: 'cliente.sexo', valdb: false},
    {id: 3, column1: 'huesped.fecha_i', column2: 'huesped.fecha_s'},
    {id: 4, column: 'servCliente.tipo_cliente', valdb: false},
    {id: 5, column: 'cliente.id_cliente', valdb: 'vetado.id_cliente'},
    {id: 6, column: 'vetado.id_cliente'},
    {id: 7, column: 'deudaClientes.deuda_total'},
    {id: 8, column: 'huesped.fecha_i'},
    {id: 9, column: 'deudaClientes.deuda_total'}
]

// const genWhereClause = (select_Filters) => {
//     const filterConditions = select_Filters.map((filter) => {
//         const columnName = filterColumnDB[filter.id];
        // return `${columnName} = ${filter.value}`;
//     });
//     return filterConditions.join(' AND ');
// };

// CHECAR REGLAS DE FILTRO
const genWhereClause = (select_Filters) => {
    const filterConditions = select_Filters.map((filter) => {
        if (Array.isArray(filter)) {
            console.log(-filter[2])
            console.log(-filter[1])
            return `${filterColumnDB[filter[0] - 1].column} BETWEEN ${-filter[2]} AND ${-filter[1]}`
        }
        else {
            if (filter == 1 || filter == 2 || filter == 4 || filter == 5) {
                return `${filterColumnDB[filter - 1].column} = ${filterColumnDB[filter - 1].valdb}`
            }
            else if (filter == 3) {
                return `${filterColumnDB[filter - 1].column1} IS NOT NULL AND ${filterColumnDB[filter - 1].column2} IS NULL`
            }
            else if (filter == 6) {
                return `${filterColumnDB[filter - 1].column} IS NULL`
            }
            else if (filter == 7) {
                return `${filterColumnDB[filter - 1].column} < 0`
            }
        }
    })
    return filterConditions.join(' AND ')
}

const getClientsByFilter = async (select_Filters) => {
    try {
        const whereClause = genWhereClause(select_Filters)
        console.log(whereClause)
        const clients = await db.any('SELECT * FROM getClientsByFilter_func($1)', [whereClause])
        return clients
    } catch (error) {
        throw error
    }
}

module.exports = { getAllClients, getClientsByFilter}
