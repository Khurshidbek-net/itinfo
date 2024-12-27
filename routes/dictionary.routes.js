const { addTerm, getAllTerms, getTermByLetter, updateTerm, deleteTerm } = require("../controllers/dictionary.controller");

const router = require("express").Router();


router.get("/terms", getAllTerms);
router.post("/create", addTerm);
router.get("/terms/letter", getTermByLetter);
router.put("/update/:id", updateTerm);
router.delete("/delete/:id", deleteTerm);


module.exports = router;

