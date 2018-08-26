const express = require("express")
const path = require("path")
const router = express.Router()
const app = express()
//const Post = require("../models/post") FOR POSTS
//const Tags = require("../models/tags") FOR TAGS
const User = require("../models/user")

const cookieparser = require("cookie-parser")
const bodyparser = require("body-parser")


//router.use("/post", require("./post"))
//router.use("/tags", require("./tags"))
router.use("/user", require("./user"))


router.use("/", (req,res,next)=>{
    
    // insert cookies
    res.locals.remember = "unchecked"
    
    if(req.cookies.remember)           
        res.locals.remember=req.cookies.remember   
    if(req.cookies.username)           
        res.locals.username=req.cookies.username   
    if(req.cookies.password)           
        res.locals.password=req.cookies.password   

    next()
})

router.get("/", (req, res) => {
    console.log("GET /")

    res.render("index.hbs")
})

router.get("/home", (req, res) => {
    console.log("GET /home")
    
    res.render("home.hbs")
})

//router.get("/profile", (req, res) => {
//    console.log("GET /profile")
//    
//    res.render
//})

router.get("/logout", (req, res) => {
    console.log("GET /logout")
    
    console.log(req.session.username + 's session is destroyed')
    
    req.session.destroy((err) => {
        if(err){
            console.log(err)
        }
    })
    
//    res.render
})

module.exports = router