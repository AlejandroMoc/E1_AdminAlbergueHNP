const router = require("express").Router();
const {
  verifyRefreshToken,
  generateAccessToken,
  functionRefreshToken,
} = require("../queries/LoginQueries.js");

//Este archivo es requivalente a localhost:8008/refreshtoken
//el refreshtoken se manda a llamar en el AuthProvider
router.post("/", async (req, res) => {
  const refreshToken = req.headers;


  if (refreshToken) {

    try {
      const rows = await functionRefreshToken(refreshToken);


      if (rows && rows.length > 0) {
        const found = rows[0];

        const payload = verifyRefreshToken(found.token);
        if (payload) {
          const accessToken = generateAccessToken(payload.user);
          res.status(200).json({ body: { accessToken } });
        } else {
          res.status(401).send({ error: "Unauthorized2" });
        }
      } else {
        res.status(401).send({ error: "Unauthorized1" });
      }
    } catch (error) {
      res.status(401).send({ error: "Unauthorized3" });
    }
  } else {
    res.status(401).send({ error: "Unauthorized4" });
  }
});

module.exports = router;
