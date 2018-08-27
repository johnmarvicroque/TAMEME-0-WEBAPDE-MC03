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
    
    privacy : Boolean,
    
    tags : {
        type : Array,
        items : String
    },
    
    user : {
        type : String,
        required : true
    },
    
    shared : {
        type : Array,
        items : String
    }
    
})

var Post = mongoose.model("post", postSchema)


module.exports.createPost = function(post){
    return new Promise(function(resolve, reject){
        var p = new Post(post)

        p.save().then((newPost)=>{
            resolve(newPost)
        }, (err)=>{
            reject(err)
        })
    })
}
    
                   
module.exports.deletePost = function(id){
    return new Promise(function(resolve, reject){
        
        Post.remove({
            _id : id
        }).then((post)=>{
            resolve(post)
        }, (err)=>{
            reject(err)
        }) 
    })
}

module.exports.editPost = function(id, updatedPost){
    return new Promise(function(resolve, reject){
        
        Post.findOneAndUpdate({
            _id : id
        }, updatedPost).then((post)=>{
            resolve(post)
        }, (err)=>{
            reject(err)
        })       
    })
}

module.exports.getPublicPost = function(){
    return new Promise(function(resolve, reject){
        
        Post.find({
            privacy : false
        }).then((posts)=>{
            resolve(posts)
        }, (err)=>{
            reject(err)
        })
    })
}

module.exports.getAllPost = function(){
    return new Promise(function(resolve, reject){
        
        Post.find().then((posts)=>{
            resolve(posts)
        }, (err)=>{
            reject(err)
        })
    })
}