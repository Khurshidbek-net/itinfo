const router = require("express").Router();

const dictRoute = require("./dictionary.routes");
const categoryRoute = require("./category.routes");
const descRoute = require("./desc.routes");
const synRoute = require('./synonym.routes');
const authorRoute = require("./author.routes");
const socialRoute = require("./social.routes");
const topicRoute = require("./topic.routes");
const tagRoute = require("./tag.routes");
const authSocialRoute = require("./auth_social.routes");
const userRoute = require("./user.routes");
const adminRoute = require("./admin.routes");


router.use("/admin", adminRoute);
router.use("/user", userRoute);
router.use("/dictionary", dictRoute);
router.use("/category", categoryRoute);
router.use("/description", descRoute);
router.use("/synonym", synRoute);
router.use("/author", authorRoute);
router.use("/social", socialRoute);
router.use("/topic", topicRoute);
router.use("/tag", tagRoute);
router.use("/auth/social", authSocialRoute);





module.exports = router;