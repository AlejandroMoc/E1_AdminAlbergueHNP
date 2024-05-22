/*Conexio a la bd*/
const pgp=require('pg-promise')();

const cn={
    host: 'localhost',
    port: '5432',
    database: 'Dump_2.16',
    user:'postgres',
    password:'',
    allowExitOnIdle:true
}

const db = pgp(cn);
module.exports = db;
