/*Conexio a la bd*/
const pgp=require('pg-promise')();

const cn={
    host: 'localhost',
    port: '5432',
    database: 'dump_2.18',
    user:'postgres',
    password:'Papucho135#',
    allowExitOnIdle:true
}

const db = pgp(cn);
module.exports = db;