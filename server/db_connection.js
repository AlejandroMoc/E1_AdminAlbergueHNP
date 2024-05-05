/*Conexio a la bd*/
const pgp=require('pg-promise')();

const cn={
    host: 'localhost',
    port: '5432',
    database: 'albergueee',  //Nombre de la base de DATOS
    user:'postgres',
    password:'chicha91.', //Contraseña de PGAdmin
    allowExitOnIdle:true
}

const db = pgp(cn);
module.exports = db;
