const db = require('../db_connection');

//Función para info de usuario
const infoUser = async(id_usuario) => {
    try {
        const user = await db.one(
            `SELECT *
            FROM usuario
            WHERE id_usuario = $1`, [id_usuario]
        )
        return user
    } catch (error) {
        throw error
    }
}

module.exports = {infoUser}
