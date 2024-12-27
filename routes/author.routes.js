const { getAllAuthors, createAuthor, getAuthorById, updateAuthor, deleteAuthor, loginAuthor, logoutAuthor, refreshAuthorToken, activateAuthor } = require("../controllers/author.controller");
const author_police = require("../police_middleware/author_police");
const author_self_police = require("../police_middleware/author_self_police");

const router = require("express").Router();



router.get("/", author_police, getAllAuthors);
router.get("/:id", getAuthorById);
router.get("/activate/:link", activateAuthor)
router.post("/", createAuthor);
router.put("/:id", author_police, author_self_police, updateAuthor);
router.delete("/:id", author_police, author_self_police, deleteAuthor);
router.post("/login", loginAuthor);
router.post("/logout", logoutAuthor);
router.post("/refresh", refreshAuthorToken);


module.exports = router;  