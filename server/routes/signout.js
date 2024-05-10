const db = require('../db_connection');
const { getTokenFromHeader } = require("../queries/LoginQueries");
const router = require("express").Router();

//esto equivale a localhost:8000/delete
router.delete("/", async (req, res) => {
  try {
    const refreshToken = getTokenFromHeader(req.headers);

    if (refreshToken) {
      await pool.query("DELETE FROM tokens WHERE token = $1", [refreshToken]);
      res.status(200).json({ message: "Token deleted" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;