const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { makeReponse } = require("../config/helper");

const authMiddleware = async (req, res, next) => {
  const bearer = req.headers['authorization'];

  if(bearer) {
      const token = bearer.split(' ')[1];
      try {
          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          req.user = await User.findById(decoded.id).select("-password");
          next();
      } catch (error) {
          return res.status(401).send(makeReponse(false, {}, 'Not Authorized Please Login'))
      }
  } else {
      return res.status(401).send(makeReponse(false, {}, 'Not Authorized Please Login'))
  }
};

module.exports = { authMiddleware };