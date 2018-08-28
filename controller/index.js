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
router.use("/profile", require("./profile"))


router.use("/", (req,res,next)=>{
    
    // insert cookies
    res.locals.remember = "unchecked"
    
    if(req.cookies.remember)           
        res.locals.remember=req.cookies.remember   
    if(req.cookies.username)           
        res.locals.username=req.cookies.username   

    next()
})

router.get("/", (req, res) => {
    console.log("GET /")

    Post.getPublicPost().then((posts)=>{
        res.render("index.hbs", {
            posts
        })
    },(err)=>{
        console.log("Error: /login")
    })
})

module.exports = router