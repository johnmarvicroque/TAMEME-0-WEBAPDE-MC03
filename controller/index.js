const express = require("express")
const path = require("path")
const router = express.Router()
const app = express()
const Post = require("../models/post")
//const Tags = require("../models/tags")
const User = require("../models/user")

const cookieparser = require("cookie-parser")
const bodyparser = require("body-parser")


router.use("/post", require("./post"))
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

router.get("/profile", (req, res) => {
    console.log("GET /profile")
    
    res.render
})

module.exports = router