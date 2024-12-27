const { getAllAdmins, registerAdmin, loginAdmin, deleteAdmin, getAdminById, updateAdmin, refreshAdminToken, logoutAdmin } = require("../controllers/admin.controller");
const admin_police = require("../police_middleware/admin_police");
const admin_self_police = require("../police_middleware/admin_self_police");
const creator_police = require("../police_middleware/creator_police");

const router = require("express").Router();


router.get("/", admin_police, getAllAdmins);
router.post("/register", registerAdmin);
router.get("/:id",admin_police, admin_self_police, getAdminById);
router.post("/login", loginAdmin);
router.post("/refresh", refreshAdminToken);
router.post("/logout", logoutAdmin);
router.put("/:id", admin_police, admin_self_police, updateAdmin);
router.delete("/:id", admin_police, admin_self_police, deleteAdmin);


module.exports = router;