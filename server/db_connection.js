/*Conexio a la bd*/
const pgp = require('pg-promise')();

const cn={
    host: 'localhost',
    port: '5432',
    database: 'gestionAlbergue',
    user:'postgres',
    password:'admin123',
    allowExitOnIdle:true
}

const db = pgp(cn);
module.exports = db;