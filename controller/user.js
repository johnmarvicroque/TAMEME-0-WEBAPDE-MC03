const express = require("express")
const router = express.Router()
const User = require("../models/user")
//const Post = require("../models/post")
//const Tags = require("../models/tags")
const bodyparser = require("body-parser")
const crypto = require("crypto")
const session = require("express-session");

const app = express()

const urlencoder = bodyparser.urlencoded({
  extended : true
})

router.use(urlencoder)

router.use(session({
    
    secret : "supersecretsecret",
    name : "super secret",
    resave : true,
    saveUninitialized : true,
    cookie : {
        maxAge: 1000*60*60*24*7*3
    }
}));


router.post("/login", urlencoder, (req,res)=>{
    console.log("POST /home")
    
    let userLogIn = {
        username: req.body.loginUsername,
        password: req.body.loginPassword
    }
    
    User.authenticate(userLogIn).then((user)=>{
        if(user.password == userLogIn.password){
            request.session.username = username
            res.render("home.hbs", {
                profileName: user.username
                //TODO: filtered posts
            })
        }
    }, (err)=>{
        console.log("Error: /login")
    })
})


router.post("/register", (req, res)=>{
    console.log("POST /register")
    
    var username = req.body.signupUsername
    var password = req.body.signupPassword
    var description = req.body.signupDescription
    var cryptedPassword = crypto.createHash("md5").update(password).digest("hex")
    if(password < 6){
        res.render("index.hbs", {
            errorSignup: "Password must be at least 6 characters",
            opensignupModal: "Something Went Wrong"
        })
    }
    
    else{
        User.checkHitUsername(username).then((user)=>{
            if(user){
                res.render("index.hbs", {
                    errorSignup: "Username is already taken!!!",
                    opensignupModal: "Something Went Wrong"
                })
            }
            else{
                var u = new User({
                    username, 
                    password: cryptedPassword, description
                })
                User.createUser(u).then((newUser)=>{
                    res.render("index.hbs", {
                        goodSignup: "Sign up successful!",
                        openloginModal: "Good request"
                    })
                }, (error)=>{
                    res.send("Something went wrong!")
                })
            }
        }, (err)=>{
            console.log("Error: /register")
        })   
    }
})


app.get("/logout", (req, res)=>{
    console.log("Get /logout")
    
    res.redirect("/")
})

module.exports = router