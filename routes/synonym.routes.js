const { getAllSyns, createSyn, getSynByid, updateSyn, deleteSyn } = require("../controllers/synonym.controller");

const router = require("express").Router();


router.get("/", getAllSyns);
router.post("/", createSyn);
router.get("/:id", getSynByid);
router.put("/:id", updateSyn);
router.delete("/:id", deleteSyn);

module.exports = router;