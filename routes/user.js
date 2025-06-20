const express = require("express");
const wrapAsync = require("../utils/wrapAsync");
const route = express.Router();
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware");
const userController = require("../controllers/user");

route.route("/signup")
.get( userController.signupRoute)
.post(wrapAsync(userController.signupInfoRoute));

// signup route
// route.get("/signup", userController.signupRoute);

// post user info
// route.post("/signup", wrapAsync(userController.signupInfoRoute));

// login route
route.route("/login")
.get(userController.loginRoute)
.post(
  saveRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  userController.loginInfoRoute
);


// route.get("/login", userController.loginRoute);

// route.post(
//   "/login",
//   saveRedirectUrl,
//   passport.authenticate("local", {
//     failureRedirect: "/login",
//     failureFlash: true,
//   }),
//   userController.loginInfoRoute
// );

route.get("/logout", userController.logoutRoute);

module.exports = route;
