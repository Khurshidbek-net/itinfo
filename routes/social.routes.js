const { createSocial, getAllSocial, updateSocial, deleteSocial } = require("../controllers/social.controller");

const router = require("express").Router();

router.post("/", createSocial);
router.get("/", getAllSocial);
router.put("/:id", updateSocial);
router.delete("/:id", deleteSocial);


module.exports = router;