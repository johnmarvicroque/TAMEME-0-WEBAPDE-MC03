const express = require("express")
const path = require("path")
const router = express.Router()
const app = express()
const Post = require("../models/post")
const Tags = require("../models/tags")
const User = require("../models/user")

const cookieparser = require("cookie-parser")
const bodyparser = require("body-parser")


router.use("/post", require("./post"))
//router.use("/tags", require("./tags"))
router.use("/user", require("./user"))

router.get("/searchByTag", function(req,res){
    console.log("/GET/searchByTag")
    var tag = req.query.searchTag
    var user = req.session.username
    var renderPosts = []
    
    Tag.getPostByTag(tag).then((posts)=>{
        
        posts.forEach(function(post, index, postsArray){
            
            if(post.privacy == false){
                renderPosts.push(post)
            }else{
                post.shared.forEach(function(sharedUser, index, sharedArray){
                    if(sharedUser == user){
                        renderPosts.push(post)
                    }
                })
                
            }
            
        })
        
    }, (err)=>{
        console.log("Error: /searchByTag")
    })
})