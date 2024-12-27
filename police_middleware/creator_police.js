const Admin = require("../schemas/Admin");

module.exports = async function(req, res, next) {
  try {
    const { id } = req.params;

    const admin = await Admin.findById(id);

    console.log(admin);

    if(id !== req.admin.id){
      return res.status(403).send({ message: "You cannot send this request!" });
    }

    if(!admin.is_creator)
      return res.status(403).send({ message: "You must be creator admin to send this request" });

    next();
  } catch (error) {
    console.log(error);
    return res.status(403).send({ message: error.message });
  }
}