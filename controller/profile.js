const express = require("express")
const router = express.Router()
const app = express()
const Post = require("../models/post")
const Tags = require("../models/tags")
const User = require("../models/user")
const cookieparser = require("cookie-parser")

router.use("/post", require("./post"))
router.use("/user", require("./user"))
//router.use("/tags", require("./tags"))

router.get("/userProfile", function(req,res){
    console.log("GET /")
    
    var uname = req.session.username
    
    User.getPostByUser(uname).then((posts)=>{
        var renderPosts=[]
        posts.forEach(function(post, index, postsArray){
            renderPosts.push({_id : post.post._id,
                              title : post.post.title,
                              filename : post.post.filename,
                              originalfilename : post.post.originalfilename,
                              privacy : post.post.privacy,
                              tags : post.post.tags,
                              user : post.post.user,
                              shared : post.post.shared})
        })
        
        User.checkHitUsername(uname).then((user)=>{
            res.render("profile.hbs", {
                renderPosts,
                user: user
            })
        },(err)=>{
            console.log("ERROR")
        })
    }, (err)=>{
        console.log("Error: /userProfile")
    })
})

router.get("/userProfile/:user", function(req, res){
    var userClicked = req.params.user
    var currentUser = req.session.username
    console.log(userClicked)
    
    if(userClicked == currentUser){
        User.getPostByUser(userClicked).then((posts)=>{
            var renderPosts=[]
            posts.forEach(function(post, index, postsArray){
                renderPosts.push({_id : post.post._id,
                                  title : post.post.title,
                                  filename : post.post.filename,
                                  originalfilename : post.post.originalfilename,
                                  privacy : post.post.privacy,
                                  tags : post.post.tags,
                                  user : post.post.user,
                                  shared : post.post.shared})
            })
            
            User.checkHitUsername(currentUser).then((user)=>{
                res.render("profile.hbs", {
                    renderPosts,
                    user: user
                })
            },(err)=>{
                console.log("ERROR")
            })
        }, (err)=>{
            console.log("Error: /userProfile")
        })
    }
    
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