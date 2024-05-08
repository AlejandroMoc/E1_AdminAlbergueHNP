const router = require("express").Router();
const {getNewLogin} = require('../queries/LoginQueries.js');

router.post('/', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).send("Fields are required");
    }
    try {
      const nombre_u = req.body.username;
      const contrasena = req.body.password;
  
      // TODO: Perform the login process and retrieve the necessary data
      const loginResult = await getNewLogin(nombre_u, contrasena);
      const { existingUser, accessToken, refreshToken } = loginResult;
  
      res.status(200).json({
        body: {
          user: existingUser,
          accessToken: accessToken,
          refreshToken: refreshToken
        }
      });
    } catch (error) {
      console.error("Error logging in:", error);
      res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;