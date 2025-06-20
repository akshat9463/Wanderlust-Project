if(process.env.NODE_ENV != "production"){
  require("dotenv").config();
}


const express = require("express");
const app = express();
const mongoose = require("mongoose");
const port = 8080;
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const User = require('./models/user.js');
const passport = require('passport');
const LocalStrategy = require("passport-local");


// all routes.
const listing = require("./routes/listing.js");
const review = require("./routes/review.js");
const userRouter = require("./routes/user.js");

const dbUrl = process.env.MONGOATLAS_URL;

main()
  .then(() => {
    console.log("connected to db.");
  })
  .catch((err) => console.log("mongodb connection error", err));

async function main() {
  await mongoose.connect(dbUrl);
  // await mongoose.connect('mongodb://127.0.0.1:28017/wanderLust');
}

const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600,
});

store.on("error",()=>{
  console.log("error in mongo session stroe", err);
});

const sessionOptions = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie:{
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true
  }
}

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));
app.use(session(sessionOptions));
app.use(flash());
// for using passport we have to use session... // pbkdf2 hasing function is used by passport.
app.use(passport.initialize());  // for initializing passport.
// Usage: Middleware to support persistent login sessions (used with express-session). 
// Requires: express-session and serializeUser/deserializeUser.
app.use(passport.session()); 
// Registers a strategy (e.g., LocalStrategy, GoogleStrategy).
passport.use(new LocalStrategy(User.authenticate()));
// Determines which data of the user object should be stored in the session.
passport.serializeUser(User.serializeUser());
// Retrieves full user object from the session-stored ID.
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  res.locals.currUser = req.user;
  next();
});

app.get("/user", async (req,res)=>{
  let fakeUser = new User({
    email: "akshat@gmail.com",
    username:"delta-student",
  });
  let registeredUser = await User.register(fakeUser,"hello");
  res.send(registeredUser);
});

app.use("/listing", listing);
app.use("/listing/:id/review" , review);
app.use("/", userRouter);




app.get("/", (req, res, next) => {
  // next(new ExpressError(404, "Welcome To WanderLust"));
  // req.flash("success","&#x2705; Welcome to WanderLust");
  res.render("./listings/welcome.ejs");
});



app.use((err, req, res, next) => {
  let { status = 500, message = "something went wrong." } = err;
  res.status(status).render("error.ejs", { err });
});

app.listen(port, (req, res) => {
  console.log(`app is listening at ${port}`);
});
