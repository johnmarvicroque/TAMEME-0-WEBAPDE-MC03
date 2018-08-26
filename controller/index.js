const express = require("express")
const path = require("path")
const router = express.Router()
const app = express()
//const Post = require("../models/post") FOR POSTS
//const Tags = require("../models/tags") FOR TAGS
const User = require("../models/user")
//router.use("/post", require("./post"))
//router.use("/tags", require("./tags"))
router.use("/user", require("./user"))

router.get("/", (req, res)=>{
    console.log("GET /")

    res.render("index.hbs")
})

module.exports = router