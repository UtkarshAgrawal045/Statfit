const express = require("express");
const app = express();
const path = require("path");
const ejsMate = require("ejs-mate");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");

const Value = require("./models/value");
const User = require("./models/user");

// Middleware for login check
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  req.flash("error", "You must be signed in first.");
  res.redirect("/");
}

// MongoDB connection
mongoose.connect("mongodb://127.0.0.1:27017/statfit")
  .then(() => console.log("MongoDB connection open!"))
  .catch(err => console.log("MongoDB connection error!", err));

// View engine setup
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware setup
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride("_method"));

// Session configuration
app.use(session({
  secret: "thisshouldbeabettersecret!",
  resave: false,
  saveUninitialized: true,
}));

// Flash messages
app.use(flash());

// Passport configuration
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Global middleware for flash and user
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currentUser = req.user;
  next();
});

// Routes
app.get("/", (req, res) => {
  res.render("listings/login");
});

app.post("/", passport.authenticate("local", {
  failureRedirect: "/",
  failureFlash: true
}), (req, res) => {
  req.flash("success", "Welcome back!");
  res.redirect("/home");
});

app.get("/signup", (req, res) => {
  res.render("listings/signup");
});

app.post("/signup", async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const newUser = new User({ email, username });
    const registeredUser = await User.register(newUser, password);
    console.log(registeredUser._id);
    const x=new Value({owner:registeredUser._id});
    x.save();
    req.login(registeredUser, err => {
      if (err) return next(err);
      req.flash("success", "Welcome to STATFIT!");
      res.redirect("/home");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/signup");
  }
});

app.get("/home", isLoggedIn, async (req, res) => {
  try {
    const userValues = await Value.find({ owner: req.user._id });
    res.render("listings/home", { allListings: userValues });
  } catch (e) {
    console.log(e);
    req.flash("error", "Failed to load your data.");
    res.redirect("/");
  }
});

app.put("/home/bmi", isLoggedIn, async (req, res) => {
  try {
    const { height, weight } = req.body;
    const h = parseFloat(height);
    const w = parseFloat(weight);
    const bmi = (w * 10000) / (h * h);

    await Value.findOneAndUpdate(
      { owner: req.user._id },
      { bmi },
      { new: true, upsert: true }
    );

    const userValues = await Value.find({ owner: req.user._id });
    res.render("listings/home", { allListings: userValues });
  } catch (err) {
    console.error("Error in PUT /home/bmi:", err.message);
    res.status(500).send("Server error");
  }
});

app.put("/home/steps", isLoggedIn, async (req, res) => {
  try {
    const { steps } = req.body;
    let calories=steps*0.05;
    await Value.findOneAndUpdate(
      { owner: req.user._id },
      { steps,calories },
      { new: true, upsert: true }
    );

    const userValues = await Value.find({ owner: req.user._id });
    res.render("listings/home", { allListings: userValues });
  } catch (err) {
    console.error("Error in PUT /home/steps:", err.message);
    res.status(500).send("Server error");
  }
});

app.put("/home/workout", isLoggedIn, async (req, res) => {
  try {
    const { workout } = req.body;

    await Value.findOneAndUpdate(
      { owner: req.user._id },
      { workout },
      { new: true, upsert: true }
    );

    const userValues = await Value.find({ owner: req.user._id });
    res.render("listings/home", { allListings: userValues });
  } catch (err) {
    console.error("Error in PUT /home/steps:", err.message);
    res.status(500).send("Server error");
  }
});

app.put("/home/sleep", isLoggedIn, async (req, res) => {
  try {
    const { sleep } = req.body;

    await Value.findOneAndUpdate(
      { owner: req.user._id },
      { sleep },
      { new: true, upsert: true }
    );

    const userValues = await Value.find({ owner: req.user._id });
    res.render("listings/home", { allListings: userValues });
  } catch (err) {
    console.error("Error in PUT /home/steps:", err.message);
    res.status(500).send("Server error");
  }
});

app.put("/home/water", isLoggedIn, async (req, res) => {
  try {
    const { water } = req.body;
    await Value.findOneAndUpdate(
      { owner: req.user._id },
      { water },
      { new: true, upsert: true }
    );

    const userValues = await Value.find({ owner: req.user._id });
    res.render("listings/home", { allListings: userValues });
  } catch (err) {
    console.error("Error in PUT /home/steps:", err.message);
    res.status(500).send("Server error");
  }
});

app.get("/contact",async(req,res)=>{
  res.render("listings/contact");
})

app.get("/blogs",async(req,res)=>{
  res.render("listings/blogs");
})

// Start server
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});