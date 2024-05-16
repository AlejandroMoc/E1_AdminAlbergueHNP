const express = require('express');
const cors = require('cors');
const app = express();
const authenticate = require("../client/src/auth/authenticate");
require('dotenv').config();

const port = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

//Importar las rutas (para no tener todo dentro del server.js)
//TODO modificar estas para que empiecen por /api/ o algo asi
app.use("/signup", require("./routes/signup"));
app.use("/login", require("./routes/login"));
app.use("/refreshtoken", require("./routes/refreshToken"));
app.use("/signout", require("./routes/signout"));
app.use("/user", authenticate, require("./routes/user"));
// app.use("/todos", authenticate, require("./routes/todos"));

const {getAllDispBeds, getAllAreas, getAllClientInfo, registerNewPatient, registerEntradaUnica } = require('./queries/UsernewQueries.js');
const {getAllClients, getClientsByFilter, banClient, unbanClient, deleteClient } = require('./queries/UserListQueries.js');
const {getHuespedInfo, getclienteInfoD, getDeudaCliente, getServicioEU, getNewRegister, getTipoCliente, getVetado, getNotaVeto}= require('./queries/InfoUserQueries.js');
const {getInfo, regServacio, regPago, regSalida, eliminarCama, anadCama} = require('./queries/RoomAdminQueries.js');
const {getAllUsers, getAllHuespedes, getUserInfo, getAllVisitantes,getAllVetados, getAllGeneralHuespedes, getAllGeneralVisitantes, getAllGeneralVetados, getAllIngresos} = require('./queries/ReportQueries.js');
const { verify } = require('jsonwebtoken');

//TODO urgente reubicar rutas en archivos separados en vez de tener todo aqui

//Funciones para UserNew
app.get('/alldispbeds', async(req, res) => {
    try {
        const beds = await getAllDispBeds();
        res.json(beds);
    } catch (error) {
        console.error('Error fetching clients:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/registerNewPatient', async(req, res) => {
    try {
        const id_u = req.body.id_u
        const carnet = req.body.carnet;
        const id_area = req.body.id_area;
        const nombre_p=req.body.nombre_p;
        const apellidos_p=req.body.apellidos_p;
        const nombre_c = req.body.nombre_c;
        const apellidos_c = req.body.apellidos_c;
        const lugar_o=req.body.lugar_o;
        const notas_c=req.body.notas_c;
        const sexo = req.body.sexo;
        const nivel_se=req.body.nivel_se;
        const id_cama=req.body.id_cama;
        const paciente=req.body.paciente;
        // console.log(apellidos_c)
        const pacienteR = await registerNewPatient(id_u, carnet, id_area, nombre_p, apellidos_p, nombre_c, apellidos_c, lugar_o, notas_c, sexo, nivel_se, id_cama, paciente);
        res.json(pacienteR);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
})  

app.post('/registerEntradaUnica', async(req, res) => {
    try {
        const id_u = req.body.id_u
        const carnet = req.body.carnet;
        const id_area = req.body.id_area;
        const nombre_p=req.body.nombre_p;
        const apellidos_p=req.body.apellidos_p;
        const nombre_c = req.body.nombre_c;
        const apellidos_c = req.body.apellidos_c;
        const lugar_o=req.body.lugar_o;
        const notas_c=req.body.notas_c;
        const sexo = req.body.sexo;
        const nivel_se=req.body.nivel_se;
        const bathroom = req.body.bathroom;
        const shower=req.body.shower;
        const breakfast=req.body.breakfast;
        const meal=req.body.meal;
        const dinner=req.body.dinner;
        const paciente=req.body.paciente;
        // console.log(apellidos_c)
        const pacienteU = await registerEntradaUnica(id_u, carnet, id_area, nombre_p, apellidos_p, nombre_c, apellidos_c, lugar_o, notas_c, sexo, nivel_se,shower, bathroom, breakfast, meal, dinner, paciente);
        res.json(pacienteU);
    } catch (error) {
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
});

app.post('/allclientinfo', async (req, res) => {
    try {
        const nombre_c = req.body.nombre;
        const apellidos_c = req.body.apellidos;
        const client = await getAllClientInfo(nombre_c, apellidos_c);
        res.json(client);
    } catch (error) {
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

// Nueva función para obtener todos los huéspedes
app.get('/allvetados', async (req, res) => {
    try {
        const allVetados = await getAllVetados();
        res.json(allVetados);
    } catch (error) {
        console.error('Error fetching vetados:', error);
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

// Funciones para ReportQueries
app.get('/allgeneralvetados', async (req, res) => {
    try {
        const startDate = req.query.startDate; // Obtener fecha de inicio del query string
        const endDate = req.query.endDate; // Obtener fecha de fin del query string
        const allgeneralvetados = await getAllGeneralVetados(startDate,endDate);
        res.json(allgeneralvetados);
    } catch (error) {
        console.error('Error fetching clients:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Funciones para ReportQueries
app.get('/allingresos', async (req, res) => {
    try {
        const startDate = req.query.startDate; // Obtener fecha de inicio del query string
        const endDate = req.query.endDate; // Obtener fecha de fin del query string
        const allingresos = await getAllIngresos(startDate,endDate);
        res.json(allingresos);
    } catch (error) {
        console.error('Error fetching clients:', error);
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

app.post('/banclient', async (req, res) => {
    try {
        const id_usuario = req.body.id_u
        const id_cliente = req.body.id_c
        const notas_v = req.body.n_v
        console.log(id_usuario)
        console.log(id_cliente)
        console.log(notas_v)
        const ban = await banClient(id_usuario, id_cliente, notas_v)
        // console.log(ban)
        res.json(ban)
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
})

app.post('/unbanclient', async (req, res) => {
    try {
        const id_cliente = req.body.id_c
        console.log(id_cliente)
        const unban = await unbanClient(id_cliente)
        res.json(unban)
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
})

app.post('/deleteclient', async (req, res) => {
    try {
        const id_cliente = req.body.id_c
        console.log(id_cliente)
        const delet = await deleteClient(id_cliente)
        res.json(delet)
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
})

//Funciones para UserInfo
//USERINFO ----------- PAGINA INFORMACIÓN DE CLIENTE++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
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
})
app.get('/deudaCliente/:id_cliente', async(req, res) => {
    try {
        const areas = await getDeudaCliente(req.params.id_cliente);
        res.json(areas);
    } catch (error) {
        console.error('Error fetching cliente DEUDA:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
})
app.get('/servicioEU/:id_cliente', async(req, res) => {
    try {
        const areas = await getServicioEU(req.params.id_cliente);
        res.json(areas);
    } catch (error) {
        console.error('Error fetching SERVICIO CLIENTE:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
})

app.post('/registrarPago', async(req, res) => {
    try {
        const pago = req.body.pago;
        const id_cliente = req.body.id_cliente;
        const registerNewPago = await getNewRegister(id_cliente, pago);
        res.json(registerNewPago);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
})  

app.get('/tipoCliente/:id_cliente', async(req, res) => {
    try {
        const areas = await getTipoCliente(req.params.id_cliente);
        res.json(areas);
    } catch (error) {
        console.error('Error fetching TIPO CLIENTE:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
})
app.get('/vetado/:id_cliente', async(req, res) => {
    try {
        const areas = await getVetado(req.params.id_cliente);
        res.json(areas);
    } catch (error) {
        console.error('Error fetching vetado CLIENTE:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
})
app.get('/notasVeto/:id_cliente', async(req, res) => {
    try {
        const areas = await getNotaVeto(req.params.id_cliente);
        res.json(areas);
    } catch (error) {
        console.error('Error fetching Notas Veto:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
})

//USERINFO ----------- PAGINA INFORMACIÓN DE CLIENTE---------------------------------------------------

//BEDS ----------- PAGINA CAMAS-----------------
app.get('/beds', async (req, res) => {
    try {
        const info = await getInfo();
        res.json(info);
    } catch (error) {
        console.error('Error fetching clients:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
})

app.post('/beds/pagar', (req, res) => {
    const id_cliente = req.body.id_cliente;
    const notas_P = req.body.notas_p;
    const monto_T = req.body.monto_t;
    regPago(id_cliente, notas_P, monto_T)
        .then((data) => res.json(data))
        .catch((error) => console.log('ERROR: ', error));
})

app.post('/beds/addCama', (req, res) => {
    const id = req.body.id_zona;
    anadCama(id)
        .then((data) => res.json(data))
        .catch((error) => console.log('ERROR: ', error));
})

app.post('/beds/regSalida', (req, res) => {
    const id = req.body.id_cliente;
    regSalida(id)
        .then((data) => res.json(data))
        .catch((error) => console.log('ERROR: ', error));
})

app.post('/beds/eliminarCama', (req, res) => {
    const id = req.body.id_cama;
    eliminarCama(id)
        .then((data) => res.json(data))
        .catch((error) => console.log('ERROR: ', error));
})

app.post('/beds/regServacio', (req, res) => {
    const id = req.body.id_cliente;
    const id_s = req.body.id_servicio;
    const can = req.body.cant;
    regServacio(id, id_s, can)
        .then((data) => res.json(data))
        .catch((error) => console.log('ERROR: ', error));
})

//Para LogIn y Signup se han importado las rutas arriba

app.listen(port, () =>{
    console.log('Servidor corriendo en el puerto 8000')
});