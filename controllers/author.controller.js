const Author = require("../schemas/Author");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("config");
const { authorValidation } = require("../validations/author.validation");
const authorJwt = require("../services/jwt_service");
const { to } = require("../helpers/to_promise");
const uuid = require("uuid");
const mailService = require("../services/mail.service");

const createAuthor = async (req, res) => {
  try {
    const { error, value } = authorValidation(req.body);
    if (error) return res.status(400).send({ message: error.message });

    const {
      first_name,
      last_name,
      nick_name,
      email,
      phone,
      password,
      info,
      position,
      photo,
      is_expert,
      author_is_active,
    } = value;
    const hashedPassword = bcrypt.hashSync(password, 7);

    const activation_link = uuid.v4();

    const author = await Author.create({
      first_name,
      last_name,
      nick_name,
      email,
      phone,
      password: hashedPassword,
      activation_link,
      info,
      position,
      photo,
      is_expert,
      author_is_active,
    });
    await mailService.sendMailActivateCode(value.email, 
      `${config.get("api_url")}/api/author/activate/${activation_link}`
    );

    res.status(201).send({ message: "Author created successfully" });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error creating author", error: error.message });
  }
};

const loginAuthor = async (req, res) => {
  try {
    const { email, password } = req.body;
    const author = await Author.findOne({ email });
    if (!author)
      return res.status(401).send({ message: "Invalid email or password" });

    const validPassword = bcrypt.compareSync(password, author.password);
    if (!validPassword)
      return res.status(401).send({ message: "Invalid email or password" });

    const payload = {
      id: author._id,
      email: author.email,
      is_active: author.author_is_active,
    };


    const tokens = authorJwt.generateTokens(payload);

    author.refresh_token = tokens.refreshToken;
    await author.save();
    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      maxAge: config.get('refresh_token_ms')
    });
    
    // try {
    //   setTimeout(function(){
    //     const err = new Error("UncaughtException");
    //     throw err
    //   }, 1000)
    // } catch (error) {
    //   console.log(error)
    // }

    // new Promise((_, reject) =>{
    //   reject(new Error("unhandledRejection example"));
    // });

    // const token = jwt.sign(payload, config.get('tokenKey'), { expiresIn: config.get('tokenTime') });

    res.status(200).send({ message: "Login successfully", accessToken: tokens.accessToken, author_id: author._id });
  } catch (error) {
    res.status(500).send({ message: "Error logging in", error: error.message });
  }
};


const logoutAuthor = async(req, res) =>{
  try {
    const {refreshToken} = req.cookies;
    console.log(refreshToken);

    if(!refreshToken)
      return res.status(400).send({message: "Token not found"});

    const author = await Author.findOneAndUpdate(
      {refresh_token: refreshToken},
      {refresh_token: ""},
      {new: true}
    );

    if(!author)
      return res.status(404).send({message: "Author not found with this token"})

    res.clearCookie("refreshToken");

    res.status(200).send({message: "Logout successfully", resfresh_token: author.refresh_token});
  } catch (error) { 
    res.status(500).send({ message: "Error logging out", error: error.message });
  }
};


const activateAuthor = async(req, res) =>{
  try {
    const link = req.params.link;
    const author = await Author.findOne({activation_link:link});

    if(!author){
      return res.status(400).send({message: "Author not found"});
    }

    if(author.author_is_active)
      return res.status(400).send({message: "Author is already active"});

    author.author_is_active = true;
    await author.save();

    res.send({message: "Author activated successfully", is_active: author.author_is_active});

  } catch (error) {
    res.status(500).send({error: error.message });
  }
}

const refreshAuthorToken = async (req, res) =>{
  try {
    const {refreshToken} = req.cookies;

    if(!refreshToken)
      return res.status(400).send({message: "Token not found"});

    const [error, tokenFromCookie] = await to(authorJwt.verifyRefreshToken(refreshToken));

    if(error)
      return res.status(401).send({message: error.message});

    const author = await Author.findOne({refresh_token: refreshToken});

    if(!author)
      return res.status(401).send({message: error.message});

    const payload = {
      id: author._id,
      email: author.email,
      is_active: author.author_is_active,
    };


    const tokens = authorJwt.generateTokens(payload);

    author.refresh_token = tokens.refreshToken;
    await author.save();
    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      maxAge: config.get('refresh_token_ms')
    });

    res.status(200).send({ accessToken: tokens.accessToken});

  } catch (error) {
    res.status(500).send({error: error.message });
  }
}

const getAllAuthors = async (req, res) => {
  try {
    const authors = await Author.find();
    res.status(200).send({ authors });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error retrieving authors", error: error.message });
  }
};

const getAuthorById = async (req, res) => {
  try {
    const { id } = req.params;

    const author = await Author.findById(id);

    if (!author) return res.status(404).send({ message: "Author not found" });

    res.status(200).send({author});
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error retrieving author by id", error: error.message });
  }
};

const updateAuthor = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      first_name,
      last_name,
      nick_name,
      email,
      phone,
      password,
      info,
      position,
      photo,
      is_expert,
      author_is_active,
    } = req.body;

    const updateAuthor = await Author.findByIdAndUpdate(
      id,
      {
        first_name,
        last_name,
        nick_name,
        email,
        phone,
        password,
        info,
        position,
        photo,
        is_expert,
        author_is_active,
      },
      { new: true }
    );

    if (!updateAuthor)
      return res.status(404).send({ message: "Author not found" });

    res.status(200).json({ message: "Author updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error updating author" });
  }
};

const deleteAuthor = async (req, res) => {
  try {
    const { id } = req.body;

    const author = await Author.findByIdAndDelete(id);
    if (!author) return res.status(404).send({ message: "Author not found" });

    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error deleting author", error: error.message });
  }
};

module.exports = {
  createAuthor,
  getAllAuthors,
  getAuthorById,
  updateAuthor,
  deleteAuthor,
  loginAuthor,
  logoutAuthor,
  refreshAuthorToken,
  activateAuthor
};
