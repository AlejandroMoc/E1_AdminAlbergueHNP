const { getTokenFromHeader, verifyRefreshToken, generateAccessToken } = require("../../../server/queries/LoginQueries.js");

function authenticate(req, res, next){
    const token = getTokenFromHeader(req.headers);

    if (token){
        const decoded = verifyAccessToken(token);
        if (decoded){
            req.user = { ...decoded.user},
            next();
        }else{
            res.status(401).json({
                message: "No token provided",
            });
        }
    }else{
        res.status(401).json({
            message: "No token provided",
        });
    }

}

module.exports = authenticate;