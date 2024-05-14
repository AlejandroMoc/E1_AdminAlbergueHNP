/*Conexio a la bd*/
const pgp=require('pg-promise')();

const cn={
    host: 'localhost',
    port: '5432',
    database: 'dataBB',  //Nombre de la base de DATOS
    user:'postgres',
    password:'12345', //Contraseña de PGAdmin
    allowExitOnIdle:true
}

const db = pgp(cn);
module.exports = db;
