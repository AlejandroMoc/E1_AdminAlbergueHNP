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
    username: user.nombre_u,
    id: user.id_usuario,
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
  return generateRefreshToken(existingUser);
};

const createAccessToken = async (existingUser) => {
  try {
    const accessToken = await generateAccessToken(existingUser);

    await db.none(
      `INSERT INTO tokens (id_token, token) VALUES (DEFAULT, $1)`,
      [accessToken]
    );

    return accessToken;
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
    console.log(existingUser);
    
    const accessToken = await createAccessToken(existingUser);
    const refreshToken = await createRefreshToken(existingUser);

    console.log("accessToken");
    console.log(accessToken);
    console.log("refreshToken");
    console.log(refreshToken);
    return { existingUser: getUserInfo(existingUser), accessToken, refreshToken };

  } catch (error) {
    throw error;
  }
};

function getTokenFromHeader(headers) {
  if (headers && headers.authorization) {
    const parted = headers.authorization.split(' ');
    if (parted.length === 2) {
      return parted[1];
    } else {
      return null;
    }
  } else {
    return null;
  }
}

//Funciones para validar tokens

function verifyAccessToken(token){
  return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
}
function verifyRefreshToken(token){
  return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
}

module.exports = { getNewAdmin, getNewLogin, generateAccessToken, generateRefreshToken, getTokenFromHeader, verifyAccessToken, verifyRefreshToken};