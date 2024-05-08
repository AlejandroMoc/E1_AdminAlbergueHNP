const db = require('../db_connection');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");

//Funciones para generación de Tokens
function sign(payload, isAccessToken){
  return jwt.sign(
    payload,
    isAccessToken
    ? process.env.ACCESS_TOKEN_SECRET
    : process.env.REFRESH_TOKEN_SECRET,
    {
      algorithm:"HS256",
      expiresIn: 3600,
    }
  );
}

function getUserInfo(user){
  return{
    username: user.username,
    id: user.id,
  };
}

function generateAccessToken(user) {
  return sign({user},true);
}

function generateRefreshToken(user){
  return sign({user}, false);
}

//Para crear un token y asignarlo
const createRefreshToken = async (existingUser) => {
  const generateToken = generateAccessToken(existingUser);
  return generateToken;
};

const createAccessToken = async (existingUser) => {
  const refreshToken = generateAccessToken(existingUser);
  try {
    await db.none(
      `INSERT INTO tokens (id_token, token) VALUES (DEFAULT,$1)`,
      [refreshToken]
    );
    return refreshToken;
  } catch (error) {
    throw error;
  }
};

//Funciones para SignUp y LogIn
const getNewAdmin = async (nombre_u, contrasena) => {
  try {
    const hashedPassword = await bcrypt.hash(contrasena, 10);
    const existingUser = await db.oneOrNone(
      'SELECT * FROM usuario WHERE nombre_u = $1',
      [nombre_u]
    );
    if (existingUser) {
      throw new Error('El nombre de usuario ya está en uso.');
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

const getNewLogin = async (nombre_u, contrasena) => {
  try {
    const existingUser = await db.oneOrNone(
      'SELECT * FROM usuario WHERE nombre_u = $1',
      [nombre_u]
    );
    if (!existingUser) {
      throw new Error('Las credenciales son incorrectas.');
    }
    console.log(existingUser.contrasena);

    const passwordMatch = await bcrypt.compare(contrasena, existingUser.contrasena);
    if (!passwordMatch) {
      throw new Error('Las credenciales son incorrectas.');
    }
    console.log("Inicio de sesión exitoso");
    console.log(existingUser)

    const accessToken = createAccessToken(existingUser);
    const refreshToken = createRefreshToken(existingUser);
    return { existingUser: getUserInfo(existingUser), accessToken, refreshToken };

  } catch (error) {
    throw error;
  }
};

module.exports = { getNewAdmin, getNewLogin, generateAccessToken, generateRefreshToken};