/*Conexio a la bd*/
const pgp=require('pg-promise')();

const cn={
    host: 'localhost',
    port: '5432',
    database: 'baseGGz',
    user:'postgres',
    password:'12345',
    allowExitOnIdle:true
}

const db = pgp(cn);
module.exports = db;