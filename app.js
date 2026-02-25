require("express-async-errors");
require("dotenv").config();

const express = require("express");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const passport = require("passport");
const passportInit = require("./passport/passportInit");
const connectFlash = require("connect-flash");
const helmet = require("helmet");

const app = express();
const url = process.env.MONGO_URI;

// View engine
app.set("view engine", "ejs");

// Security
app.use(helmet());

// Body parsing
app.use(express.urlencoded({ extended: true }));

// MongoDB session store
const store = new MongoDBStore({
  uri: url,
  collection: "mySessions",
});

// Session config
const sessionParms = {
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: store,
  cookie: {
    secure: false,
    httpOnly: true,
    sameSite: "lax",
  },
};

if (app.get("env") === "production") {
  app.set("trust proxy", 1);
  sessionParms.cookie.secure = true;
}

app.use(session(sessionParms));

// Passport
passportInit();
app.use(passport.initialize());
app.use(passport.session());

// Flash
app.use(connectFlash());
app.use(require("./middleware/storeLocals"));

// Routes
app.get("/", (req, res) => res.render("index"));
app.use("/session", require("./routes/sessionRoutes"));
app.use("/secretWord", require("./middleware/auth"), require("./routes/secretWord"));

// 404
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
    await require("./db/connect")(process.env.MONGO_URI);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();