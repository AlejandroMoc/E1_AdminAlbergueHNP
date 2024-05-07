const db = require('../db_connection');
const bcrypt = require('bcrypt');

const getNewAdmin = async (nombre_u, contrasena) => {
  try {
    // console.log("Registrando nuevo admin:", nombre_u);
    const hashedPassword = await bcrypt.hash(contrasena, 10);
    
    // Check if the username already exists in the database
    const existingUser = await db.oneOrNone(
      'SELECT * FROM usuario WHERE nombre_u = $1',
      [nombre_u]
    );
    
    if (existingUser) {
      throw new Error('El nombre de usuario ya está en uso.'); // Throw an error if the username already exists
    }
    
    await db.none(
      `INSERT INTO usuario (nombre_u, contrasena) VALUES ($1, $2)`,
      [nombre_u, hashedPassword]
    );
    
    console.log("Se insertó nuevo admin");
  } catch (error) {
    throw error;
  }
};

module.exports = { getNewAdmin };