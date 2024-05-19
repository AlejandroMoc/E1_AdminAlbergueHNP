const router = require("express").Router();
const {changeAdminPassword} = require('../queries/LoginQueries.js');

router.post('/', async(req, res) => {

    //TODO debo enviar el id actual del admin, no solo la contra
    const {username, actual_password, new_password1, new_password2} = req.body;
    console.log('para cambiar la contra se envia', username, actual_password, new_password1, new_password2);
    if (!username || !actual_password || !new_password1 || !new_password2){
        return res.status(400).send("All fields are required");
    }

    try{
        const nombre_u =req.body.username;
        const contrasena = req.body.actual_password;
        console.log("El usuario al que se le quiere cambiar la contra es",nombre_u);

        await changeAdminPassword(nombre_u, contrasena, new_password1,new_password2);
        res.status(200).json("Password changed successfully from route");
    } catch(error){
        console.error("Error changing password from route:", error);
        res.status(500).json({error: 'Internal server error' });
    }

    // const {username, password} = req.body;
    // console.log(username, ' ', password)
    // if (!username || !password){
    //     return res.status(400).send("Fields are required");
    // }
    // try{
    //     const nombre_u=req.body.username;
    //     const contrasena=req.body.password;
    //     await getNewAdmin(nombre_u, contrasena);
    //     res.status(200).json("User created successfully");
});

module.exports = router;