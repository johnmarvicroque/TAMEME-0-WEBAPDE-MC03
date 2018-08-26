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
mongoose.connect("mongodb://localhost:27017/memeify", {
    useNewUrlParser: true
});

app.set("view-engine", "hbs")
app.use(express.static(__dirname + "/public"))

app.use(require("./controllers"))

//app.use(session({
//  secret : "secret",
//  name : "secretname",
//  resave: true,
//  saveUninitialized :true
//}))

app.listen(process.env.PORT || port, () => {
    console.log("Listening in port " + port);
});