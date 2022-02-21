const jwt = require("jsonwebtoken");

// auth middleware
const authMiddleware = async (req, res, next) => {
  let token = req.cookies.token;
  if (token) {
    try {
      const decoded = await jwt.verify(token, process.env.APP_SECRET);
      console.log(decoded);
      req.user = decoded;
      next();
    } catch (err) {
      console.log(err);
      res.redirect("/");
    }
  } else {
    res.redirect("/");
  }
};

module.exports = { authMiddleware };
