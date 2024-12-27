const User = require("../schemas/User");
const bcrypt = require('bcrypt')
const { userValidation } = require("../validations/user.validation");
const userJwt = require("../services/jwt_service");
const config = require("config");
const { to } = require("../helpers/to_promise");
const uuid = require("uuid");
const mailService = require("../services/mail.service");




const registerUser = async (req, res) => {
    try {
        const { error, value } = userValidation(req.body);

        if (error)
            return res.status(400).send({ message: error.message });

        const hashedPassword = bcrypt.hashSync(value.password, 10);
        const activation_link = uuid.v4();
        await User.create(
            { ...value, password: hashedPassword, activation_link }
        );


        await mailService.sendMailActivateCode(value.email,
            `${config.get("api_url")}/api/user/activate/${activation_link}`
        );
        res.status(201).send({ message: "User registered successfully" })

    } catch (error) {
        res.status(500).send({ message: "Error registering new user", error: error.message });
    }
}

const activateUser = async (req, res) => {
    try {
        const link = req.params.link;
        
        const user = await User.findOne({ activation_link:link });

        if (!user) {
            return res.status(400).send({ message: "User not found" });
        }

        if (user.is_user_active)
            return res.status(400).send({ message: "User is already active" });

        user.is_user_active = true; 
        await user.save();

        res.send({ message: "User activated successfully", is_user_active: user.is_user_active });

    } catch (error) {
        res.status(500).send({ error: error.message });
    }
}



const loginUser = async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
        return res.status(401).send({ message: "Invalid email or password" });

    const validPassword = bcrypt.compareSync(password, user.password);
    if (!validPassword)
        return res.status(401).send({ message: "Invalid email or password" });

    const payload = {
        id: user._id,
        name: user.name,
        email: user.email
    };

    const tokens = userJwt.generateTokens(payload);
    user.refresh_token = tokens.refreshToken;
    await user.save();

    res.cookie("refreshToken", tokens.refreshToken, {
        httpOnly: true,
        maxAge: config.get('refresh_token_ms')
    });


    res.status(200).send({ message: "Login successfully", ...tokens });

}

const logoutUser = async (req, res) => {
    try {
        const { refreshToken } = req.cookies;

        if (!refreshToken)
            return res.status(400).send({ message: "Token not found" });

        const user = await User.findOneAndUpdate(
            { refresh_token: refreshToken },
            { refresh_token: "" },
            { new: true }
        );

        if (!user)
            return res.status(404).send({ message: "User not found with this token" });

        res.clearCookie("refreshToken");
        res.status(200).send({ message: "Logout successfully", refresh_token: user.refresh_token });
    } catch (error) {
        res.status(500).send({ message: "Error logging out", error: error.message });
    }
}


const refreshUserToken = async (req, res) => {
    try {
        const { refreshToken } = req.cookies;

        if (!refreshToken)
            return res.status(400).send({ message: "Token not found" });

        const [error, tokenFromCookie] = await to(userJwt.verifyRefreshToken(refreshToken));

        if (error)
            return res.status(401).send({ message: error.message });

        const user = await User.findOne({ refresh_token: refreshToken });

        if (!user)
            return res.status(401).send({ message: "User not found or invalid refresh token" });


        const payload = {
            id: user._id,
            name: user.name,
            email: user.email
        };

        const tokens = userJwt.generateTokens(payload);
        user.refresh_token = tokens.refreshToken;
        await user.save();

        res.cookie("refreshToken", tokens.refreshToken, {
            httpOnly: true,
            maxAge: config.get("refresh_token_ms")
        })

        res.status(200).send({ accessToken: tokens.accessToken });

    } catch (error) {
        res.status(500).send({ error: error.message });
    }
}

const getUserById = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findById(id);

        if (!user) return res.status(404).send({ message: "User not found" });

        res.status(200).send({ data: user });
    } catch (error) {
        res
            .status(500)
            .send({ message: "Error retrieving user by id", error: error.message });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).send({ users });
    } catch (error) {
        res.status(500).send({ message: "Error retrieving users", error: error.message });
    }
}


const updateUser = async (req, res) => {
    try {
        const { id } = req.params;

        const { name, email, password, info, photo, is_user_active } = req.body;

        const updatedUser = await User.findByIdAndUpdate(
            id,
            { name, email, password, info, photo, is_user_active },
            { new: true }
        );

        if (!updatedUser)
            return res.status(404).send({ message: "User not found" });

        res.status(200).send({ message: "User updated successfully" });

    } catch (error) {
        res.status(500).send({ message: "Error updating user", error: error.message });
    }
}


const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        const deleteUser = await User.findByIdAndDelete(id);
        if (!deleteUser)
            res.status(404).send({ message: "User not found successfully" });

        res.status(200).send({ message: "User deleted successfully" });

    } catch (error) {
        res.status(500).send({ message: "Error deleting user", error: error.message });
    }

}

module.exports = {
    registerUser,
    getAllUsers,
    loginUser,
    updateUser,
    deleteUser,
    logoutUser,
    refreshUserToken,
    getUserById,
    activateUser
}