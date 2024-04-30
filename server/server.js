const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const {getAllDispBeds, getAllAreas, getAllClientInfo } = require('./queries/UsernewQueries.js')
const { getAllClients, getClientsByFilter } = require('./queries/UserListQueries.js');
const { getHuespedInfo, getclienteInfoD, getDeudaCliente, getServicioEU}= require('./queries/InfoUserQueries.js')
const { getAllUsers, getAllHuespedes, getUserInfo, getAllVisitantes, getAllGeneralHuespedes, getAllGeneralVisitantes} = require('./queries/ReportQueries.js');

//Funciones para UserNewAdmin
app.get('/alldispbeds', async(req, res) => {
    try {
        const beds = await getAllDispBeds();
        res.json(beds);
    } catch (error) {
        console.error('Error fetching clients:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/allareas', async(req, res) => {
    try {
        const areas = await getAllAreas();
        res.json(areas);
    } catch (error) {
        console.error('Error fetching clients:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


app.get('/allusers', async (req, res) => {
    try {
        const startDate = req.query.startDate; // Obtener fecha de inicio del query string
        const endDate = req.query.endDate; // Obtener fecha de fin del query string
        const allusers = await getAllUsers(startDate, endDate); // Llamar a getAllUsers con las fechas
        res.json(allusers);
    } catch (error) {
        console.error('Error fetching clients:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Nueva función para obtener todos los huéspedes
app.get('/allhuespedes', async (req, res) => {
    try {
        const allHuespedes = await getAllHuespedes();
        res.json(allHuespedes);
    } catch (error) {
        console.error('Error fetching huespedes:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Nueva función para obtener todos los huéspedes
app.get('/allvisitantes', async (req, res) => {
    try {
        const allVisitantes = await getAllVisitantes();
        res.json(allVisitantes);
    } catch (error) {
        console.error('Error fetching visitantes:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/userinfo/:userID', async (req, res) => {
    try {
        const userID = req.params.userID; // Obtiene el userID de los parámetros de la URL
        const clientInfo = await getUserInfo(userID); // Llama a la función que obtiene la información del cliente según el ID
        res.json(clientInfo); // Devuelve la información del cliente como respuesta
    } catch (error) {
        console.error('Error fetching client info:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Funciones para ReportQueries
app.get('/allgeneralhuespedes', async (req, res) => {
    try {
        const startDate = req.query.startDate; // Obtener fecha de inicio del query string
        const endDate = req.query.endDate; // Obtener fecha de fin del query string
        const allgeneralhuespedes = await getAllGeneralHuespedes(startDate,endDate);
        res.json(allgeneralhuespedes);
    } catch (error) {
        console.error('Error fetching clients:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Funciones para ReportQueries
app.get('/allgeneralvisitantes', async (req, res) => {
    try {
        const startDate = req.query.startDate; // Obtener fecha de inicio del query string
        const endDate = req.query.endDate; // Obtener fecha de fin del query string
        const allgeneralvisitantes = await getAllGeneralVisitantes(startDate,endDate);
        res.json(allgeneralvisitantes);
    } catch (error) {
        console.error('Error fetching clients:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});




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
});

//Funciones para UserListAdmin
app.get('/allclients', async (req, res) => {
    try {
        const clients = await getAllClients();
        res.json(clients);
    } catch (error) {
        console.error('Error fetching clients:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

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

//USERINFO ----------- PAGINA INFORMACIÓN DE CLIENTE-----------------
app.get('/clienteInfo/:id_cliente', async(req, res) => {
    try {
        const areas = await getclienteInfoD(req.params.id_cliente);
        res.json(areas);
    } catch (error) {
        console.error('Error fetching cliente INFORMACIÓN:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
})
app.get('/huespedInfo/:id_cliente', async(req, res) => {
    try {
        const areas = await getHuespedInfo(req.params.id_cliente);
        res.json(areas);
    } catch (error) {
        console.error('Error fetching cliente INFORMACIÓN:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/deudaCliente/:id_cliente', async(req, res) => {
    try {
        const areas = await getDeudaCliente(req.params.id_cliente);
        res.json(areas);
    } catch (error) {
        console.error('Error fetching cliente DEUDA:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/servicioEU/:id_cliente', async(req, res) => {
    try {
        const areas = await getServicioEU(req.params.id_cliente);
        res.json(areas);
    } catch (error) {
        console.error('Error fetching SERVICIO CLIENTE:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// app.get('/hello', (req, res) => {
//     res.json({message:"Hola"});
// })

app.listen(8000, () =>{
    console.log('Servidor corriendo en el puerto 8000')
});