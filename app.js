/*******************IMPORTS**********************/

const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const bodyparser = require("body-parser");
const cookieparser = require("cookie-parser");
const hbs = require("hbs");


/*******************  SETUP  **********************/
const app = express();
const port = 3000;

mongoose.Promise = global.Promise
mongoose.connect("mongodb://localhost:27017/Tameme-0", {
    useNewUrlParser: true
});

app.set("view-engine", "hbs")
app.use(express.static(__dirname + "/public"))

app.use(cookieparser())

app.use(session({
  secret : "secret",
  name : "secretname",
  resave: true,
  saveUninitialized :true,
    
  cookie: {
    maxAge: 21*24*60*60*1000 //3 weeks
  }
}))

app.use(require("./controller"))

app.listen(process.env.PORT || port, () => {
    console.log("Listening in port " + port);
});