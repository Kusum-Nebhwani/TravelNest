const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const User = require("../models/user.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/user.js");

router
  .route("/signup")
  //signup --get
  .get(userController.RenderSignUp);
//signup --post
router.post("/signup", wrapAsync(userController.signup));

router
.route("/login")
//login --get
.get(userController.RenderLogIn)
//login --post
.post(
  saveRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  userController.login
);

//logout --get
router.get("/logout", userController.logout);
module.exports = router;
