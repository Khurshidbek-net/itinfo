const { to } = require("../helpers/to_promise");
const userJwt = require("../services/jwt_service");

module.exports = async function (req, res, next) {
  try {
    const { id } = req.params;

    if (id !== req.user.id) {
      return res.status(403).send({ message: "You cannot send this request!" });
    }
    next();
  } catch (error) {
    console.log(error);
    return res.status(403).send({ message: error.message });
  }
};
