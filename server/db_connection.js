/*Conexio a la bd*/
const pgp=require('pg-promise')();

const cn={
    host: 'localhost',
    port: '5432',
    database: 'Dump_2.1',  //Nombre de la base de DATOS
    user:'postgres',
    password:'danielA19', //Contraseña de PGAdmin
    allowExitOnIdle:true
} 

const db = pgp(cn);
module.exports = db;
