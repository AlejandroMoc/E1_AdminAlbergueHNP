const db = require('../server/db_connection');
const { getTokenFromHeader } = require("../server/queries/LoginQueries");

//esto equivale a localhost:8000/delete
// const refreshToken = getTokenFromHeader(req.headers);
// console.log(refreshToken)

// if (refreshToken) {
//     db.query("DELETE FROM tokens WHERE token = $1", [refreshToken]);
//     res.status(200).json({ message: "Token deleted" });
// }

console.log('Hola')