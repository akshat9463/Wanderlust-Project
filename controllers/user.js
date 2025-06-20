const User = require("../models/user");
const passport = require("passport");

module.exports.signupRoute = (req, res) => {
  res.render("users/signup.ejs");
};

module.exports.signupInfoRoute = async (req, res) => {
  try {
    let { username, email, password } = req.body;
    const newUser = new User({ email, username });
    const registeredUser = await User.register(newUser, password);
    //   console.log(registeredUser);
    req.login(registeredUser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "Welcome to WanderLust !");
      res.redirect("/listing");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/signup");
  }
};

module.exports.loginRoute = (req, res) => {
  res.render("users/login.ejs");
};

module.exports.loginInfoRoute = async (req, res) => {
  req.flash("success", "Welcome back to WanderLust!");
  let redirectUrl = res.locals.redirectUrl || "/listing";
  res.redirect(redirectUrl);
};

module.exports.logoutRoute = (req, res, next) => {
  req.logOut((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "You have logged Out Successfully!");
    res.redirect("/listing");
  });
};
