const Admin = require("../schemas/Admin");
const { adminValidation } = require("../validations/admin.validation")
const bcrypt = require("bcrypt");
const adminJwt = require("../services/jwt_service");
const config = require("config");
const { to } = require("../helpers/to_promise");


const registerAdmin = async (req, res) => {
  try {
    const { error, value } = adminValidation(req.body);
    if (error)
      return res.status(400).send({ message: error.message });

    const hashedPassword = bcrypt.hashSync(value.password, 10);

    await Admin.create(
      { ...value, password: hashedPassword }
    );
    res.status(201).send({ message: "Admin registered successfully"  });

  } catch (error) {
    res.status(500).send({ message: "Error registering admin", error: error.message });
  }
}

const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });


    if (!admin)
      return res.status(401).send({ message: "Invalid email or password" });

    const validPassword = bcrypt.compareSync(password, admin.password);

    if (!validPassword)
      return res.status(401).send({ message: "Invalid email or password" });

    const payload = {
      id: admin._id,
      name: admin.name,
      email: admin.email,
      is_active: admin.is_active,
      is_creator: admin.is_creator
    };

    const tokens = adminJwt.generateTokens(payload);

    admin.refresh_token = tokens.refreshToken;
    await admin.save();

    res.cookie("refreshToken", tokens.refreshToken,{
      httpOnly: true,
      maxAge: config.get('refresh_token_ms')
    })

    res.status(200).send({ message: "Login successfully", ...tokens });
  } catch (error) {
    res.status(500).send({ message: "Error logging in", error: error.message });
  }
}

const logoutAdmin = async(req, res) =>{
  try {
    const {refreshToken} = req.cookies;

    if(!refreshToken)
      return res.status(400).send({message: "Token not found"});

    const admin = await Admin.findOneAndUpdate(
      {refresh_token: refreshToken},
      {refresh_token: ""},
      {new: true}
    );

    if(!admin)
      return res.status(404).send({message: "Admin not found with this token"});

    res.clearCookie("refreshToken");
    res.status(200).send({message: "Logout successfully", refresh_token: admin.refresh_token});

  } catch (error) {
    res.status(500).send({ message: "Error logging out", error: error.message });
  }
}


const refreshAdminToken = async(req, res) =>{
  try {
    const {refreshToken} = req.cookies;

    if(!refreshToken)
      return res.status(400).send({message: "Token not found"});

    const [error, tokenFromCookie] = await to(adminJwt.verifyRefreshToken(refreshToken));

    if(error)
      return res.status(401).send({message: error.message});

    const admin = await Admin.findOne({refresh_token: refreshToken});

    if (!admin)
      return res.status(401).send({ message: "Admin not found or invalid refresh token" });
    

    const payload = {
      id: admin._id,
      name: admin.name,
      email: admin.email,
      is_active: admin.is_active,
      is_creator: admin.is_creator
    };

    const tokens = adminJwt.generateTokens(payload);

    admin.refresh_token = tokens.refreshToken;
    await admin.save();

    res.cookie("refreshToken", tokens.refreshToken,{
      httpOnly: true,
      maxAge: config.get('refresh_token_ms')
    });

    res.status(200).send({accessToken: tokens.accessToken});

  } catch (error) {
    res.status(500).send({error: error.message});
  }
}


const getAllAdmins = async (req, res) => {
  try {
    const admins = await Admin.find();
    res.status(200).send({ admins: admins });
  } catch (error) {
    res.status(500).send({ message: "Error retrieving admins", error: error.message });
  }
}

const getAdminById = async (req, res) => {
  try {
    const { id } = req.params;

    const admin = await Admin.findById(id);

    if (!admin) return res.status(404).send({ message: "Admin not found" });

    res.status(200).send({ data: admin });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error retrieving admin by id", error: error.message });
  }
};


const updateAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      email,
      phone,
      password,
      is_active,
      is_creator
    } = req.body;

    const updateAdmin = await Admin.findByIdAndUpdate(
      id,
      {
        name,
        email,
        phone,
        password,
        is_active,
        is_creator
      },
      { new: true }
    );

    if (!updateAdmin)
      return res.status(404).send({ message: "Admin not found" });

    res.status(200).json({ message: "Admin updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error updating admin" });
  }
};


const deleteAdmin = async(req, res) =>{
  try {
    const {id} = req.params;

    const deleteAdmin = await Admin.findByIdAndDelete(id);

    if(!deleteAdmin)
      return res.status(404).send({message: "Admin not found"});

    res.status(200).send({message: "Admin deleted successfully"});
  } catch (error) {
    res.status(500).send({message: "Error deleting adim"});
  }

}


module.exports = {
  registerAdmin,
  loginAdmin,
  getAllAdmins,
  getAdminById,
  updateAdmin,
  deleteAdmin,
  logoutAdmin,
  refreshAdminToken
}