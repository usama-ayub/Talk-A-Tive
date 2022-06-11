const jwt = require("jsonwebtoken");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

const makeReponse = (valid, data, message, extra = {}) => {
  return {
      valid: valid,
      data: valid ? data : [],
      errors: !valid ? data : [],
      message: message || '',
      ...extra
  }
}

module.exports = {generateToken,makeReponse};