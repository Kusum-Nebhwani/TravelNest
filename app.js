if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}


const express = require("express");
const app = express();
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const localStrategy = require("passport-local");
const User = require("./models/user.js");
const ejs = require('ejs');


const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

const ExpressError = require("./utils/ExpressError.js");

const users = require("./routes/user.js");
const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");

const port = 8000;

const db_url = process.env.ATLAS_DB_URL;


app.set("view engine", "ejs");

app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));
app.engine("ejs", ejsMate);

main()
  .then(() => {
    console.log("connected to DB!");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(db_url);
}
const store = MongoStore.create({
  mongoUrl: db_url,
  crypto:{
    secret : process.env.SECRET,
  },
  touchAfter:24*3600

})
store.on("error",(err)=>{ console.log("error in Mongose Sesssion Store",err); });

const sessionOptions = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};




app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});



app.get('/root', (req, res) => {
  res.render("home/home.ejs");
});



app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);
app.use("/", users);

app.use("*", (req, res, next) => {
  next(new ExpressError(404, "Page not Found!"));
});
//middleware
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something Went Wrong!" } = err;
  res.status(statusCode).render("listings/error.ejs", { message });
  // res.status(statusCode).send(message);
});




app.listen(port, () => {
  console.log(`listining on ${port}`);
});
