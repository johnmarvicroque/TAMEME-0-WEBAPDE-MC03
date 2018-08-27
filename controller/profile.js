const express = require("express")
const router = express.Router()
const app = express()
const Post = require("../models/post")
//const Tags = require("../models/tags")
const User = require("../models/user")
const cookieparser = require("cookie-parser")

router.use("/post", require("./post"))
router.use("/user", require("./user"))
//router.use("/tags", require("./tags"))

router.get("/userProfile", function(req,res){
    console.log("GET /")
    
    var user = req.session.username
    
    User.getPostByUser(user).then((posts)=>{
        
        res.render("profile.hbs", {
            posts
        })
        
    }, (err)=>{
        console.log("Error: /userProfile")
    })
    
    res.render("index")
})

router.get("/visitProfile", function(req,res){
    console.log("GET /")
    
    var user = req.session.username
    var visitUser = req.query.userProfile
    var renderPosts = []
    
    User.getPostByUser(visitUser).then((posts)=>{
        
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
        
        res.render("profile.hbs", {
            renderPosts
        })
        
    }, (err)=>{
        console.log("Error: /visitProfile")
    })
    
    res.render("index")
})

module.exports = router