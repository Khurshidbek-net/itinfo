const { createDesc, getAllDesc, getDescById, updateDesc, deleteDesc } = require("../controllers/description.controller");

const router = require("express").Router();



router.post("/", createDesc);
router.get("/", getAllDesc);
router.get("/:id", getDescById);
router.put("/id", updateDesc);
router.delete("/:id", deleteDesc);  



module.exports = router;