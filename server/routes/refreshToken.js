const db = require('../db_connection');
const router = require("express").Router();
const { getTokenFromHeader, verifyRefreshToken, generateAccessToken } = require('../queries/LoginQueries.js');

router.post('/', async (req, res) => {
  const refreshToken = getTokenFromHeader(req.headers);

  //SOLUCIONAR AQUIII
  // console.log(refreshToken);
  // console.log(req.headers);
  if (refreshToken) {

    try {
      const query = 'SELECT * FROM tokens WHERE token = $1';
      const values = [refreshToken];

      const rows = await db.query(query, values);
      const found = rows[0];

      if (!found) {
        res.status(401).send({ error: 'Unauthorized1' });
      } else {
        const payload = verifyRefreshToken(found.token);
        if (payload) {
          const accessToken = generateAccessToken(payload.user);
          res.status(200).json({ body: { accessToken } });
        } else {
          res.status(401).send({ error: 'Unauthorized2' });
        }
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