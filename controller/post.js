const express = require("express")
const multer = require("multer")
const router = express.Router()
const User = require("../models/user")
const Post = require("../models/post")
const Tag = require("../models/tags")
const bodyparser = require("body-parser")
const crypto = require("crypto")
const fs = require("fs")
const path = require("path")

const app = express()

const urlencoder = bodyparser.urlencoded({
    extended : true
})

const UPLOAD_PATH = path.resolve(path.dirname("post.js").split(path.sep).pop(), "uploads")
const upload = multer({
    dest: UPLOAD_PATH,
    limits: {
        fileSize : 10000000,
        files : 2
    }
})

router.use(urlencoder)

router.post("/createHomePost", upload.single("img"), (req,res)=>{
    console.log("POST /post/createPost")
    
    var currentUser = req.session.username
    
    var user = req.body.userPost
    var parsedShared
    var parsedTag = req.body.tagPost.split(' ')
    var isChecked = req.body.isPrivate
    var privacy
    
    var renderPosts = []
    console.log(isChecked)
    
    if(isChecked == "on"){
        privacy = true
        parsedShared = req.body.sharedPost.split(' ')
    }else{
        privacy = false
        //parsedShared = []
    }
    
    
    var p = {
        title : req.body.titlePost,
        filename : req.file.filename,
        originalfilename : req.file.originalname,
        privacy : privacy,
        tags : parsedTag,
        user : user,
        shared : parsedShared
    }
    
    Post.createPost(p).then((createdPost)=>{
        console.log(createdPost)
        
        User.addPostInUser(createdPost).then((updatedUser)=>{
            parsedTag.forEach(function(value, index, tagArray){
                
                Tag.getTag(value).then((tag)=>{
                    if(tag){
                        Tag.addPostInTag(tag.tag, createdPost).then((updatedTag)=>{
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
                        }, (err)=>{
                            console.log("Error: /createPost")
                        })
                    }else{
                        Tag.createTag(value).then((createdTag)=>{
                            console.log(createdTag)
                            Tag.addPostInTag(createdTag.tag, createdTag).then((updatedTag)=>{
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
                                
                            }, (err)=>{
                                console.log("Error: /createPost")
                            })
                        },(err)=>{
                            console.log("Error: /createPost")
                        })
                    }
                }, (err)=>{
                    console.log("Error: /createPost")
                })
            })
            
        },(err)=>{
            console.log("Error: /createPost")
        })
        
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
        
    }, (err)=>{
        console.log("Error: /createPost")
    })
})

router.post("/createProfilePost", upload.single("img"), (req,res)=>{
    console.log("POST /post/createPost")
    
    var currentUser = req.session.username
    
    var user = req.body.userPost
    var parsedShared
    var parsedTag = req.body.tagPost.split(' ')
    var isChecked = req.body.isPrivate
    var privacy
    
    var renderPosts = []
    
    if(isChecked == "on"){
        privacy = true
        parsedShared = req.body.sharedPost.split(' ')
    }else{
        privacy = false
        //parsedShared = []
    }
    
    
    var p = {
        title : req.body.titlePost,
        filename : req.file.filename,
        originalfilename : req.file.originalname,
        privacy : privacy,
        tags : parsedTag,
        user : user,
        shared : parsedShared
    }
    
    Post.createPost(p).then((createdPost)=>{
        console.log(createdPost)
        
        User.addPostInUser(createdPost).then((updatedUser)=>{
            parsedTag.forEach(function(value, index, tagArray){
                
                Tag.getTag(value).then((tag)=>{
                    if(tag){
                        Tag.addPostInTag(tag.tag, createdPost).then((updatedTag)=>{
                            User.getPostByUser(currentUser).then((posts)=>{
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
                                        user: user,
                                        currentUser: currentUser
                                    })
                                },(err)=>{
                                    console.log("ERROR")
                                })
                            }, (err)=>{
                                console.log("Error: /userProfile")
                            })
                        }, (err)=>{
                            console.log("Error: /createPost")
                        })
                    }else{
                        Tag.createTag(value).then((createdTag)=>{
                            console.log(createdTag)
                            Tag.addPostInTag(createdTag.tag, createdTag).then((updatedTag)=>{
                                User.getPostByUser(currentUser).then((posts)=>{
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
                                            user: user,
                                            currentUser: currentUser
                                        })
                                    },(err)=>{
                                        console.log("ERROR")
                                    })
                                }, (err)=>{
                                    console.log("Error: /userProfile")
                                })
                                
                            }, (err)=>{
                                console.log("Error: /createPost")
                            })
                        },(err)=>{
                            console.log("Error: /createPost")
                        })
                    }
                }, (err)=>{
                    console.log("Error: /createPost")
                })
            })
            
        },(err)=>{
            console.log("Error: /createPost")
        })
        
        User.getPostByUser(currentUser).then((posts)=>{
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
                    user: user,
                    currentUser: currentUser
                })
            },(err)=>{
                console.log("ERROR")
            })
        }, (err)=>{
            console.log("Error: /userProfile")
        })
        
    }, (err)=>{
        console.log("Error: /createPost")
    })
})

router.post("/deletePost", (req,res)=>{
    console.log("/POST/deletePost")
    
    var id = req.body.deleteID
    var username = req.session.username
    
    
    Post.getPost(id).then((gotPost)=>{
        
        Post.deletePost(id).then((deletedPost)=>{
            User.deletePostInUser(username, gotPost).then((updatedUser)=>{
                User.getPostByUser(username).then((posts)=>{
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
                    
                    User.checkHitUsername(username).then((user)=>{
                        res.render("profile.hbs", {
                            renderPosts,
                            user: user,
                            currentUser: username
                        })
                    },(err)=>{
                        console.log("ERROR")
                    })
                }, (err)=>{
                    console.log("Error: /userProfile")
                })              
            }, (err)=>{
                console.log("Error")
            })
        }, (err)=>{
            console.log("Error")
        })
    }, (err)=>{
        console.log("Error eto!")
    })
    
    
    //    Post.deletePost(id).then((deletedPost)=>{
    //        
    //        User.deletePostInUser(username, id).then((updatedUser)=>{
    //            console.log(id)
    ////            deletedPost.tags.forEach(function(value, index, tagArray){
    ////                
    ////                Tag.getTag(value).then((tag)=>{
    ////                    
    ////                    Tag.deletePostInTag(tag.tag, deletedPost._id).then((updatedTag)=>{
    ////                        //Deleted AJAX
    ////                    },(err)=>{
    ////                        console.log("Error: /deletePost")
    ////                    })
    ////                    
    ////                }, (err)=>{
    ////                    console.log("Error: /deletePost")
    ////                })
    ////            })
    //            
    //        },(err)=>{
    //            console.log("Error: /deletePost")
    //        })
    //        
    //        res.redirect("/userProfile")
    //        
    //    },(err)=>{
    //        console.log("Error: /deletePost")
    //    })
    
}, (err)=>{
    console.log("Error: /deletePost")
})

router.post("/editPost", (req,res)=>{
    var id = req.body.editID
    var username = req.session.username
    var title = req.body.postTitle
    var parsedShared = req.body.sharedPost.split(' ')
    var parsedTag = req.body.tagPost.split(' ')
    
    let updatedPost = {
        title : title,
        tags : parsedTag,
        shared : parsedShared
    }
    
    Post.editPost(id, updatedPost).then((updatedPostInPost)=>{
        
    }, (err)=>{
        
    })
    
    //    Post.findOne({_id:id}).then((post)=>{
    //        
    //        //        post.tags.forEach(function(value, index, tagArray){
    //        //            Tag.deletePostInTag(value, post._id).then((deletedPostinTag)=>{
    //        //                console.log("deleted")
    //        //            }, (err)=>{
    //        //                console.log("Error: /editPost")
    //        //            })
    //        //        })
    //        
    //        
    //            
    ////            User.editPostInUser(updatedPostInPost.username, updatedPostInPost).then((updatedPostInUser)=>{
    //                
    //                //                updatedPostInUser.tags.forEach(function(value, index, tagArray){
    //                //                    
    //                //                    Tag.getTag(value).then((tag)=>{
    //                //                        if(tag){
    //                //                            Tag.addPostInTag(tag.tag, updatedPostInUser).then((updatedPostInTag)=>{
    //                //                                //edited post with ajax
    //                //                            }, (err)=>{
    //                //                                console.log("Error: /editPost")
    //                //                            })
    //                //                        }else{
    //                //                            Tag.createTag(value).then((createdTag)=>{
    //                //                                Tag.addPostInTag(createdTag.tag, updatedPostInUser).then((updatedPostInTag)=>{
    //                //                                    //edited post with ajax
    //                //                                }, (err)=>{
    //                //                                    console.log("Error: /editPost")
    //                //                                })
    //                //                            },(err)=>{
    //                //                                console.log("Error: /editPost")
    //                //                            })
    //                //                        }
    //                //                    }, (err)=>{
    //                //                        console.log("Error: /editPost")
    //                //                    })
    //                //                    
    //                //                })
    //                //                
    //                //            }, (err)=>{
    //                //                console.log("Error: /editPost")
    //                //            })
    //                
    ////            }, (err)=>{
    ////                console.log("Error: /editPost")
    ////            })
    //            
    //        }, (err)=>{
    //            console.log("Error: /editPost")
    //        })
    //    })
    
    
}, (err)=>{
    console.log("Error: /editPost")
})

//if error, change id to _id??
router.get("/photo/:id", (req, res)=>{
    Post.getPost({_id: req.params.id}).then((doc)=>{
        fs.createReadStream(path.resolve(UPLOAD_PATH, doc.filename)).pipe(res)
    }, (err)=>{
        console.log(err)
        res.sendStatus(404)
    })
})

module.exports = router