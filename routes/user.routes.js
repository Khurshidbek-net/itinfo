const { registerUser, getAllUsers, loginUser, updateUser, deleteUser, logoutUser, refreshUserToken, getUserById, activateUser } = require("../controllers/user.controller");
const user_police = require("../police_middleware/user_police");
const user_self_police = require("../police_middleware/user_self_police");

const router = require("express").Router();



router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/activate/:link", activateUser);
router.post("/refresh", refreshUserToken);
router.get("/", user_police, getAllUsers);
router.put("/:id", user_police, user_self_police, updateUser);
router.delete("/id", user_police, user_self_police, deleteUser);
router.post("/logout", user_police, user_self_police, logoutUser);
router.get("/:id", user_police, user_self_police, getUserById)

module.exports = router;  