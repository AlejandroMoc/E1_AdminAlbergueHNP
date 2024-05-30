const {
    getTokenFromHeader,
    verifyAccessToken,
  } = require("../../../server/queries/LoginQueries.js");
  
  function authenticate(req, res, next) {
    const token = getTokenFromHeader(req.headers);
  
    if (token) {
      try {
        const decoded = verifyAccessToken(token);
        req.user = {...decoded.user };
        next();
      } catch (error) {
        //console.log("estem",error);
        res.status(401).json({
          message: "Invalid token",
        });
      }
    } else {
      res.status(401).json({
        message: "No token provided",
      });
    }
  }
  
  module.exports = authenticate;