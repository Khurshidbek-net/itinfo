const { getAllTags, createTag } = require("../controllers/tag.controller");

const router = require("express").Router();


router.get("/", getAllTags);
router.post("/", createTag);


module.exports = router;