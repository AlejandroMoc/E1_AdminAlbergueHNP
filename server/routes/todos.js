const router = require("express").Router();
const { getTokenFromHeader, verifyRefreshToken, generateAccessToken } = require('../queries/LoginQueries.js');

router.get("/",(req,res)=>{
    res.send("todos");
});

module.exports = router;