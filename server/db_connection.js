/*Conexio a la bd*/
const pgp=require('pg-promise')();

const cn={
    host: 'localhost',
    port: '5432',
    database: 'dump_2.12',  //Nombre de la base de DATOS
    user:'postgres',
    password:'***', //Contraseña de PGAdmin
    allowExitOnIdle:true
}

const db = pgp(cn);
module.exports = db;
