const express = require('express');
const passport = require("passport");
const mongoose = require("mongoose");
const session = require("express-session");
//  const MongoStore = require("connect-mongo")(session);
const morgan = require('morgan');
const path = require("path");
const dotenv = require("dotenv");
const connectDB = require('./config/db');
const rateLimit = require("express-rate-limit");




//load config
dotenv.config({path : "./config/config.env"})
// Passport Config
require("./config/passport")(passport);

connectDB();
const app = express();

//Body Parser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(morgan("dev"));

//express-rate-limit
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10 // limit each IP to 10 requests per windowMs
  });
  
  //  apply to all requests
  app.use(limiter);

//Sessions
app.use(
    session({
      secret: "keybaord cat",
      resave: false,
      saveUninitialized: false,
    //    store: new MongoStore({ mongooseConnection: mongoose.connection }),
    })
  );

//passport middleware
app.use(passport.initialize());
app.use(passport.session());

//Setting Global Variable
app.use(function (req, res, next) {
    res.locals.user = req.user || null;
    next();
  });


//static files
app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

//routes
app.use("/",require("./routes/index"));
app.use("/auth", require("./routes/auth"));

const PORT = 3000;

app.listen(PORT,console.log(`Server is running at port ${PORT}`));