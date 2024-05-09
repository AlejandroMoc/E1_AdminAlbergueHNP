const db = require('../db_connection');
const router = require("express").Router();
const { getTokenFromHeader, verifyRefreshToken, generateAccessToken } = require('../queries/LoginQueries.js');

router.post('/', async (req, res) => {
  const refreshToken = getTokenFromHeader(req.headers);

  if (refreshToken) {

    console.log("AQUI INICIA");
    console.log(refreshToken);
    console.log("AQUI TERMINA")

    try {
      // const values = [refreshToken];
      const {rows} = await db.any(`SELECT * FROM tokens WHERE token = $1;`,refreshToken);

      //Cambiame esto
      // const query = `SELECT * FROM tokens WHERE token = $1;`;
      // const values = [refreshToken];
      // const { rows } = await db.query(query, values);

      console.log("AQUIII");
      console.log(rows);
      
      if (rows && rows.length > 0) {

        const found = rows[0];

        const payload = verifyRefreshToken(found.token);
        if (payload) {
          const accessToken = generateAccessToken(payload.user);
          res.status(200).json({ body: { accessToken } });
        } else {
          res.status(401).send({ error: 'Unauthorized2' });
        }
      } else {
        res.status(401).send({ error: 'Unauthorized1' });
      }
    } catch (error) {
      console.log(error);
      res.status(401).send({ error: 'Unauthorized3' });
    }
  } else {
    res.status(401).send({ error: 'Unauthorized4' });
  }
});

module.exports = router;