const router = require("express").Router();
const {getNewAdmin} = require('../queries/LoginQueries.js');

// router.get("/",(req,res)=>{
//     res.send("signup");
// });

router.post('/', async(req, res) => {
    const {username, password} = req.body;
    console.log(username, ' ', password)
    if (!username || !password){
        return res.status(400).send("Fields are required");
    }
    try{
        const nombre_u=req.body.username;
        const contrasena=req.body.password;
        await getNewAdmin(nombre_u, contrasena);
        res.status(200).json("User created successfully");
    } catch(error){
        console.error("Error creating user:", error);
        res.status(500).json({error: 'Internal server error' });
    }
});

module.exports = router;