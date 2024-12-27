const { createViewPage } = require("../helpers/create_view_page");

const router = require("express").Router();


router.get("/", (req, res) =>{
  res.render(createViewPage("index"), {
    title: "Asosiy sahifa",
    isHome: true
  });
});

router.get("/dictionary", (req, res) =>{
  res.render(createViewPage("dictionary"), {
    title: "Dictionary",
    isDict: true
  });
});

router.get("/topics", (req, res) =>{
  res.render(createViewPage("topics"), {
    title: "Topics",
    isTopic: true
  });
});

router.get("/authors", (req, res) =>{
  res.render(createViewPage("authors"), {
    title: "Authors",
    isAuthor: true
  });
});

router.get("/admin", (req, res) =>{
  res.render(createViewPage("admin"),{
    title: "Admins",
    isAdmin: true
  });
});

router.get("/admin_login", (req, res) =>{
  res.render(createViewPage("admin_login"),{
    title: "Admin Login",
    isAdminLogin: true
  });
});

router.get("/login", (req, res) =>{
  res.render(createViewPage("login"), {
    title: "Login",
    isLogin: true
  });
});


module.exports = router;