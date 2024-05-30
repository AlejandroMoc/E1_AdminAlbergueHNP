const db = require('../db_connection');
const router = require("express").Router();
const {verifyRefreshToken, generateAccessToken, functionRefreshToken } = require('../queries/LoginQueries.js');

//Este archivo es requivalente a localhost:8008/refreshtoken
//el refreshtoken se manda a llamar en el AuthProvider
router.post('/', async (req, res) => {

  //El refreshToken correcto no existe en la base de datos
  //y parece que no se puede acceder a /refreshtoken
  // const refreshToken = getTokenFromHeader(req.headers);
  const refreshToken = req.headers;

  // console.log("El refreshytoken es", refreshToken);

  if (refreshToken) {

    // console.log("AQUI INICIA", refreshToken);

    try {
      //AQUI pasar a sus propias queries en vez de mandar a llamarla desde aqui

      // const {rows } = await db.any(`SELECT * FROM tokens WHERE token = $1;`, [refreshToken]);
      const  rows  = await functionRefreshToken(refreshToken);

      // console.log("ESTE ES TOKENNS");
      // console.log(rows);
      
      if (rows && rows.length > 0) {

        const found = rows[0];

        const payload = verifyRefreshToken(found.token);
        if (payload) {
          const accessToken = generateAccessToken(payload.user);
          res.status(200).json({body: {accessToken } });
        } else {
          res.status(401).send({error: 'Unauthorized2' });
        }
      } else {
        res.status(401).send({error: 'Unauthorized1' });
      }
    } catch (error) {
      // console.log("Leeme este error")
      // console.log(error);
      //Se viene para aca, lo que quiere decir que no lo esta haciendo
      res.status(401).send({error: 'Unauthorized3' });
      // throw new Error(error);
    }
  } else {
    res.status(401).send({error: 'Unauthorized4' });
  }
});

module.exports = router;