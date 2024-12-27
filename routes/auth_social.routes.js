const { getAllAuthSocial, createAuthSocial, updateAuthSocial, deleteAuthSocial } = require("../controllers/auth_social.controller");

const router = require("express").Router();


router.get("/", getAllAuthSocial);
router.post("/", createAuthSocial);
router.put("/:id", updateAuthSocial);
router.delete("/:id", deleteAuthSocial);


module.exports = router;