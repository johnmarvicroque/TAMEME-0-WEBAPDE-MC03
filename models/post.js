const mongoose = require("mongoose")

var postSchema = mongoose.Schema({
    
    title : {
        type : String,
        required : true
    },
    
    filename : {
        type : String,
        required : true
    }, 
    
    originalfilename : {
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
    
                   
exports.deletePost = function(id){
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

exports.editPost = function(id, updatedPost){
    return new Promise(function(resolve, reject){
        
//        Post.findOne({_id:id}).then((post)=>{
//            
//        }, (err)=>{
//            console.log("error")
//        })
        
        Post.findOneAndUpdate({
            _id : id
        }, {title : updatedPost.title,
            tags : updatedPost.tags,
            shared : updatedPost.shared}).then((post)=>{
            resolve(post)
        }, (err)=>{
            reject(err)
        })       
    })
}

exports.getPublicPost = function(){
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

exports.getAllPost = function(){
    return new Promise(function(resolve, reject){
        
        Post.find().then((posts)=>{
            resolve(posts)
        }, (err)=>{
            reject(err)
        })
    })
}

exports.getPost = function(id){
    return new Promise(function(resolve, reject){
        Post.findOne({_id : id}).then((post)=>{
            resolve(post)
        },(err)=>{
            reject(err)
        })
    })
}