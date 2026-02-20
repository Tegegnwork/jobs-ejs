

require("express-async-errors");
require("dotenv").config(); // to load the .env file into the process.env object

const express = require("express");
const session = require("express-session");
const flash = require('connect-flash'); // Import flash
const MongoDBStore = require("connect-mongodb-session")(session);

const app = express();
const url = process.env.MONGO_URI;

// MongoDB session store
const store = new MongoDBStore({
  uri: url,
  collection: "mySessions",
});

store.on("error", function (error) {
  console.log(error);
});

// Session configuration
const sessionParms = {
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  store: store,
  cookie: { secure: false, sameSite: "strict" },
};

if (app.get("env") === "production") {
  app.set("trust proxy", 1); // trust first proxy
  sessionParms.cookie.secure = true; // serve secure cookies
}

// Middleware order is important!
app.use(session(sessionParms));
app.use(flash()); // Initialize flash AFTER session but BEFORE routes
app.set("view engine", "ejs");
app.use(require("body-parser").urlencoded({ extended: true }));

// Secret word handling
app.get("/secretWord", (req, res) => {
  if (!req.session.secretWord) {
    req.session.secretWord = "syzygy";
  }
  
  // Make flash messages available to the view
  res.locals.info = req.flash("info");
  res.locals.errors = req.flash("error");
  
  res.render("secretWord", { secretWord: req.session.secretWord });
});

app.post("/secretWord", (req, res) => {
  req.session.secretWord = req.body.secretWord;
  
  // Optional: Add flash message on update
  req.flash("info", "Secret word updated successfully!");
  
  res.redirect("/secretWord");
});

// 404 handler
app.use((req, res) => {
  res.status(404).send(`That page (${req.url}) was not found.`);
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send(err.message);
});

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();