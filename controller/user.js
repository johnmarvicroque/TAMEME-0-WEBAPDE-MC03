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
  extended : false
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


router.post("/login", (req,res)=>{
    console.log("POST /home")
    
    let userLogIn = {
        username: req.body.loginUsername,
        password: req.body.loginPassword
    }
    
       
    
    User.authenticate(userLogIn).then((newUser) =>{
        console.log("USER FOUND")
        console.log(newUser)
        
                
        if(newUser){
           req.session.username = newUser.username
            
            res.render("home.hbs", {
                profileName: newUser.username
            })
//           Post.getAll().then((posts)=>{
//             res.render("userhome.hbs", {
//                 posts
//             })
//          })
        }else{
            res.render("home.hbs", {  
                error: "Wrong credentials. Try again."
            })
        }         
    }, (error) =>{
        console.log("ERROR")
        res.render("index.hbs")
    })
    
    
    
//    User.authenticate(userLogIn).then((user)=>{
//        
//        console.log(user.username)
//        console.log(user.password)
//        console.log(user.description)
//        
//        if(user.password == userLogIn.password){
//            req.session.username = userLogin.username
//            res.render("home.hbs", {
//                profileName: user.username
//                //TODO: filtered posts
//            })
//        }
//    }, (err)=>{
//        console.log("Error: /login")
//    }, (error)=>{
//        console.log("ERROR")
//        res.render("home.hbs")
//    })
//    
    
    
})


router.post("/register",(req, res)=>{
    console.log("POST /register")
    
    var username = req.body.signupUsername
    var password = req.body.signupPassword
    var description = req.body.signupDescription

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
                var u = {
                    username, 
                    password,
                    description
                    
                }
                User.createUser(u).then((newUser)=>{
                    console.log("QWEWEWEQEWQE")
                    res.render("index.hbs")
                }, (error)=>{
                    res.send("Something went wrong!")
                })
            }
        }, (err)=>{
            console.log("Error: /register")
        })   
    }
})


router.get("/logout", (req, res) => {
    console.log("GET /logout")
    
    console.log(req.session.username + 's session is destroyed')
    
    req.session.destroy((err) => {
        if(err){
            console.log(err)
        }
    })
    
    res.render("index.hbs")
})

module.exports = router