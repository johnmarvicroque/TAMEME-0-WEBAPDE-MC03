const express = require("express")
const router = express.Router()
const crypto = require("crypto")
const User = require("../models/user")
//const Post = require("../model/post") TO BE USED 
const bodyparser = require("body-parser")

const urlencoder = bodyparser.urlencoded({
    extended: true
})

router.use(urlencoder)


router.get("/login", (req,res)=>{
    console.log("GET /login")
})
router.post("/login", (req,res) =>{
    console.log("POST /login")
})

router.post("/register", (req,res)=>{
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
        User.getUserByUsername(username).then((user)=>{
            if(user){
                res.render("index.hbs", {
                    errorSignup: "Username is already taken!!!",
                    opensignupModal: "Something Went Wrong"
                })
            }
            else{
                var u = new User({
                    username, cryptedPassword, description
                })
                User.addUser(u).then((newUser)=>{
                    res.render("index.hbs", {
                        goodSignup: "Sign up successful!",
                        openloginModal: "Good request"
                    })
                }, (error)=>{
                    res.send("Something went wrong!")
                })
            }
        }, (err)=>{
            res.send("Something went wrong!")
        })   
    }
})

router.get("/logout", (req, res) => {
    console.log("GET /logout")
    
    res.render("logout.hbs")
});

module.exports = router