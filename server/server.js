const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const {getAllDispBeds, getAllAreas, getAllClientInfo } = require('./queries/UsernewQueries.js')
const { getAllClients, getClientsByFilter } = require('./queries/UserListQueries.js');

//Funciones para UserNewAdmin
app.get('/alldispbeds', async(req, res) => {
    try {
        const beds = await getAllDispBeds();
        res.json(beds);
    } catch (error) {
        console.error('Error fetching clients:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
})

app.get('/allareas', async(req, res) => {
    try {
        const areas = await getAllAreas();
        res.json(areas);
    } catch (error) {
        console.error('Error fetching clients:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
})

app.post('/allclientinfo', async(req, res) => {
    try {
        const nombre_c = req.body.nombre;
        const apellidos_c = req.body.apellidos;
        // console.log(nombre_c)
        // console.log(apellidos_c)
        const client = await getAllClientInfo(nombre_c, apellidos_c);
        res.json(client);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
})

//Funciones para UserListAdmin
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
        const select_View = req.body.views
        const debtRange = req.body.debts
        const dateRange = req.body.dates
        console.log('select_Filters:', select_Filters);
        console.log('view: ', select_View)
        console.log('debt: ', debtRange)
        console.log('date: ', dateRange)
        const clients = await getClientsByFilter(select_Filters, select_View, debtRange, dateRange);
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
    console.log('Servidor corriendo en el puerto 8000')
})
