const { createTopic, getAllTopics, updateTopic, deleteTopic } = require("../controllers/topic.controller");

const router = require("express").Router();


router.post("/", createTopic);
router.get("/", getAllTopics);
router.put("/:id", updateTopic);
router.delete("/:id", deleteTopic);


module.exports = router;