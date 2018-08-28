const mongoose = require("mongoose")

var postSchema = mongoose.Schema({
    
    title : {
        type : String,
        required : true
    },
    
    directory: {
        type : String,
        required : true
    }, 
    
    tags : {
        type : Array,
        items : String
    },
    
    shared : {
        type : Array,
        items : String
    }
    
})

var tagSchema = mongoose.Schema({
    
    tag : {
        type : String,
        required : true
    },
    
    posts: {
        type : Array,
        items : postSchema,
        required : true
    }
    
})


var Tag = mongoose.model("tag", tagSchema)

module.exports.createTag = function(tag){
    return new Promise(function(resolve, reject){
        var t = new Tag({
            tag : tag
        })
        t.save().then((newTag)=>{
            resolve(newTag)
        }, (err)=>{
            reject(err)
        })
    })
}

module.exports.addPostInTag = function(tag, post){
    return new Promise(function(resolve, reject){
        
        Tag.findOneAndUpdate({
            tag : tag
        }, {
            $push : {posts : {post}}
        }).then((updatedTag)=>{
            resolve(updatedTag)
        }, (err)=>{
            reject(err)
        })
    })
}

module.deletePostInTag = function(tag, postId){
    return new Promise(function(resolve, reject){
        
        Tag.findOneAndUpdate({
            tag : tag
        }, {
            $pull : {posts : {_id : postId}}
        }).then((updatedTag)=>{
            resolve(updatedTag)
        }, (err)=>{
            reject(err)
        })
    })
}

exports.editPostInTag = function(tag, post){
    return new Promise(function(resolve, reject){
        
        Tag.findOneAndUpdate({
            tag : tag
        }, {
            $set: { "posts.$" : post }
        }).then((updatedTag)=>{
            resolve(updatedTag)
        }, (err)=>{
            reject(err)
        })
    })
}

exports.getPostByTag = function(tag){
    return new Promise(function(resolve, reject){
        
        Tag.findOne({
            tag : tag
        }).then((gotTag)=>{
            //TODO : filter out private posts in controller
            resolve(gotTag)
        }, (err)=>{
            reject(user)
        })
    })
}

exports.getTag = function(tag){
    return new Promise(function(resolve, reject){
        
        Tag.findOne({
            tag : tag
        }).then((gotTag)=>{
            resolve(gotTag)
        }, (err)=>{
            reject(user)
        })
    })
}