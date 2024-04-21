const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const { getAllClients, getClientsByFilter } = require('./queries/UserListQueries.js');

app.get('/allclients', async (req, res) => {
    try {
        const clients = await getAllClients();
        res.json(clients);
    } catch (error) {
        console.error('Error fetching clients:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
})

app.post('/someclients', async (req, res) => {
    try {
        const select_Filters = req.body.filters;
        console.log('select_Filters:', select_Filters);
        const clients = await getClientsByFilter(select_Filters);
        console.log('clientes:', clients)
        res.json(clients);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// app.get('/hello', (req, res) => {
//     res.json({message:"Hola"});
// })

app.listen(8000, () =>{
    console.log('Servidor corriendo en el puerto ')
})
