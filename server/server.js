const express = require('express');
const cors = require('cors');
const app = express();

// Hola
app.use(cors());
app.use(express.json());

/*Conexio a la bd*/
const pgp=require('pg-promise')();
const cn={
    host: 'localhost',
    port: '5432',
    database: 'gestionAlbergue',  //Nombre de la base de DATOS
    user:'postgres',
    password:'admin123', //Contraseña de PGAdmin
    allowExitOnIdle:true
} 

const db = pgp(cn);
app.get('/cliente', (req, res) =>{
    db.any('SELECT * FROM cliente')
    .then((data) => res.json(data))
    .catch((error) =>console.log('Error: ', error));
} )

// app.get('/hello', (req, res) => {
//     res.json({message:"Hola"});
// })

app.listen(8000, () =>{
    console.log('Servidor corriendo en el puerto ')
})