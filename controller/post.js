const express = require("express")
const router = express.Router()
const User = require("../models/user")
const Post = require("../models/post")
const Tags = require("../models/tags")
const bodyparser = require("body-parser")
const crypto = require("crypto")

const app = express()

const urlencoder = bodyparser.urlencoded({
  extended : true
})

router.use(urlencoder)

router.post("/createPost", (req,res)=>{
    console.log("POST /post/createPost")
    var user = req.session.username
    var parsedShared = req.body.sharedPost.split(' ')
    var parsedTag = req.body.tagPost.split(' ')
    
    var p = new Post({
        title : req.body.titlePost,
        directory : req.body.directoryPost,
        privacy : req.body.privacyPost,
        tags : parsedTag,
        user : user,
        shared : parsedShared
    })
    
    Post.createPost(p).then((createdPost)=>{
        
        User.addPostInUser(createdPost).then((addedPostInUser)=>{
            
            parsedTag.forEach(function(value, index, tagArray){
                
                Tag.getTag(value).then((tag)=>{
                    if(tag){
                        Tag.addPostInTag(tag.tag, addedPostInUser).then((addedPostInTag)=>{
                            //Add tag with ajax
                        }, (err)=>{
                            console.log("Error: /createPost")
                        })
                    }else{
                        Tag.createTag(value).then((createdTag)=>{
                            Tag.addPostInTag(createdTag.tag, addedPostInUser).then((addedPostInTag)=>{
                                //Add tag with ajax
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
        
        
    }, (err)=>{
        console.log("Error: /createPost")
    })
})

router.post("/deletePost", (req,res)=>{
    var id = req.body.idPost
    var username = req.session.username
    
    Post.deletePost(id).then((deletedPost)=>{
        
        User.deletePostInUser(username, deletedPost._id).then((deletedPostInUser)=>{
            
            deletedPostInUser.tags.forEach(function(value, index, tagArray){
                
                Tag.getTag(value).then((tag)=>{
                    
                    Tag.deletePostInTag(tag.tag, deletedPostInUser._id).then((deletedPostInTag)=>{
                        //Deleted AJAX
                    },(err)=>{
                        console.log("Error: /deletePost")
                    })
                    
                }, (err)=>{
                    console.log("Error: /deletePost")
                })
            })
            
        },(err)=>{
            console.log("Error: /deletePost")
        })
        
    },(err)=>{
        console.log("Error: /deletePost")
    })
    
}, (err)=>{
    console.log("Error: /deletePost")
})

router.post("/editPost", (req,res)=>{
    var id = req.body.idPost
    var username = req.session.username
    
    var parsedShared = req.body.sharedPost.split(' ')
    var parsedTag = req.body.tagPost.split(' ')
   
    let updatedPost = {
        title : req.body.titlePost,
        directory : req.body.directoryPost,
        user : username,
        tags : parsedTag,
        privacy : req.body.privacyPost,
        shared : parsedShared
    }
    
    Post.findOne({_id:id}).then((post)=>{
        
        post.tags.forEach(function(value, index, tagArray){
            Tag.deletePostInTag(value, post._id).then((deletedPostinTag)=>{
                console.log("deleted")
            }, (err)=>{
                console.log("Error: /editPost")
            })
        })
        
        Post.editPost(id, updatedPost).then((updatedPostInPost)=>{

            User.editPostInUser(updatedPostInPost.username, updatedPostInPost).then((updatedPostInUser)=>{
                
                updatedPostInUser.tags.forEach(function(value, index, tagArray){
                    
                    Tag.getTag(value).then((tag)=>{
                        if(tag){
                            Tag.addPostInTag(tag.tag, updatedPostInUser).then((updatedPostInTag)=>{
                                //edited post with ajax
                            }, (err)=>{
                                console.log("Error: /editPost")
                            })
                        }else{
                            Tag.createTag(value).then((createdTag)=>{
                                Tag.addPostInTag(createdTag.tag, updatedPostInUser).then((updatedPostInTag)=>{
                                    //edited post with ajax
                                }, (err)=>{
                                    console.log("Error: /editPost")
                                })
                            },(err)=>{
                                console.log("Error: /editPost")
                            })
                        }
                    }, (err)=>{
                        console.log("Error: /editPost")
                    })
                    
                })
                
            }, (err)=>{
                console.log("Error: /editPost")
            })

        }, (err)=>{
            console.log("Error: /editPost")
        })
        
    }, (err)=>{
        console.log("Error: /editPost")
    })
    
    
}, (err)=>{
    console.log("Error: /editPost")
})


module.exports = router