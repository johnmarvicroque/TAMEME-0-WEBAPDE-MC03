const express = require("express")
const router = express.Router()
const User = require("../models/user")
const Post = require("../models/post")
const Tags = require("../models/tags")
const bodyparser = require("body-parser")
const crypto = require("crypto")
const session = require("express-session");
const path = require("path")

const app = express()

const urlencoder = bodyparser.urlencoded({
    extended : false
})

router.use(urlencoder)
var currentLoggedIn
//router.use(session({
//    
//    secret : "supersecretsecret",
//    name : "super secret",
//    resave : true,
//    saveUninitialized : true,
//    cookie : {
//        maxAge: 1000*60*60*24*7*3
//    }
//}));

router.post("/login", (req,res)=>{
    console.log("POST /login to home")
    
    let userLogIn = {
        username: req.body.loginUsername,
        password: req.body.loginPassword
    }
    
    var renderPosts = []
    
    User.authenticate(userLogIn).then((newUser) =>{
        if(newUser){
            req.session.username = newUser.username
            
            Post.getAllPost().then((posts)=>{
                posts.forEach(function(post, index, postsArray){
                    if(post.privacy == false){
                        renderPosts.push(post)
                        
                    }else{
                        post.shared.forEach(function(sharedUser, index, sharedArray){
                            if(sharedUser == newUser.username){
                                renderPosts.push(post)
                            }
                        })
                    }
                    
                })
                var posts = renderPosts
                res.render("home.hbs", {
                    posts,
                    user : newUser
                })
            },(err)=>{
                console.log("Error: /login")
            })
        }else{
            Post.getPublicPost().then((posts)=>{
                res.render("index.hbs", {
                    posts,
                    errorLogin: "Username or Password is incorrect !!!",
                    openloginModal: "Something Went Wrong"
                })
            },(err)=>{
                console.log("Error: /login")
            })            
        }         
    }, (error) =>{
        Post.getPublicPost().then((posts)=>{
            res.render("index.hbs", {
                posts,
                errorLogin: "Username or Password is incorrect !!!",
                openloginModal: "Something Went Wrong"
            })
        },(err)=>{
            console.log("Error: /login")
        })            
    })
})

router.get("/login", (req, res)=>{
    console.log("GET /login")
    
    
    var currentUser = req.session.username
    var renderPosts = []
    
    
    User.checkHitUsername(currentUser).then((user)=>{
        Post.getAllPost().then((posts)=>{
            posts.forEach(function(post, index, postsArray){
                if(post.privacy == false){
                    renderPosts.push(post)
                    
                }else{
                    post.shared.forEach(function(sharedUser, index, sharedArray){
                        if(sharedUser == user.username){
                            renderPosts.push(post)
                        }
                    })
                }
                
            })
            var posts = renderPosts
            res.render("home.hbs", {
                posts,
                user : user
            })
        },(err)=>{
            console.log("Error: /login")
        })
    }, (err)=>{
        console.log("ERROR")
    })
})

router.post("/register",(req, res)=>{
    console.log("POST /register")
    
    var username = req.body.signupUsername
    var password = req.body.signupPassword
    var description = req.body.signupDescription
    
    if(password.length < 6){
        
        Post.getPublicPost().then((posts)=>{
            res.render("index.hbs", {
                posts,
                errorSignup: "Password must be at least 6 characters",
                opensignupModal: "Something Went Wrong"
            })
        },(err)=>{
            console.log("Error: /login")
        })
    }
    
    else{
        User.checkHitUsername(username).then((user)=>{
            if(user){
                Post.getPublicPost().then((posts)=>{
                    res.render("index.hbs", {
                        posts,
                        errorSignup: "Username is already taken!!!",
                        opensignupModal: "Something Went Wrong"
                    })
                },(err)=>{
                    console.log("Error: /login")
                })
            }
            else{
                var u = {
                    username, 
                    password,
                    description
                    
                }
                
                var renderPosts = []
                
                User.createUser(u).then((newUser)=>{
                    req.session.username = u.username
                    currentLoggedIn = newUser
                    
                    Post.getAllPost().then((posts)=>{
                        posts.forEach(function(post, index, postsArray){
                            if(post.privacy == false){
                                renderPosts.push(post)
                                
                            }else{
                                post.shared.forEach(function(sharedUser, index, sharedArray){
                                    if(sharedUser == newUser.username){
                                        renderPosts.push(post)
                                    }
                                })    
                            }
                            
                        })
                        var posts = renderPosts
                        res.render("home.hbs", {
                            posts,
                            user: newUser
                        })
                    },(err)=>{
                        console.log("Error: /login")
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

router.get("/logout", (req, res) => {
    console.log("GET /logout")
    
    console.log(req.session.username + 's session is destroyed')
    
    req.session.destroy((err) => {
        if(err){
            console.log(err)
        }
    })
    
    Post.getPublicPost().then((posts)=>{
        res.render("index.hbs", {
            posts
        })  
    },(err)=>{
        console.log("Error: /login")
    })
})

module.exports = router