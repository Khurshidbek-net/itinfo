const { createCategory, getAllCategories, getCategoryById, updateCategory, deleteCategory } = require("../controllers/category.controller");

const router = require("express").Router();


router.get("/", getAllCategories);
router.post("/", createCategory);
router.get("/:id", getCategoryById);
router.put("/:id", updateCategory);
router.delete("/:id", deleteCategory);


module.exports = router;
