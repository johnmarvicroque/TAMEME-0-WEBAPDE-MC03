const mongoose = require("mongoose")
const crypto = require("crypto")

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

var userSchema = mongoose.Schema({
    username : {
        type : String,
        required : true,
        minlength : 3,
        unique : true 
    },
    
    password : {
        type : String,
        required : true
    },
    
    description : {
        type : String,
        required : true
    },

    posts: {
        type : Array,
        items : postSchema
    }
   
    
})

userSchema.pre("save", function(next){
  this.password = crypto.createHash("md5").update(this.password).digest("hex")
  next()
})

var User = mongoose.model("user", userSchema)

module.exports.createUser = function(user){
    return new Promise(function (resolve, reject){
        var u = new User(user)
        
        u.save().then((newUser) => {
            resolve(newUser)
        }, (error) => {
            reject(error)
        })
    })
}

module.exports.checkHitUsername = function(uname){
  return new Promise(function(resolve, reject){
    
      User.findOne({username: uname}).then((user)=>{
      resolve(user)
    }, (err)=>{
      reject(err)
    })
  })
}

module.exports.authenticate = function(user){
  return new Promise(function(resolve, reject){
      
    User.findOne({
      username : user.username,
      password : crypto.createHash("md5").update(user.password).digest("hex")
    }).then((user)=>{
      resolve(user)
    },(err)=>{
      reject(err)
    })
  })
}

module.exports.editUser = function(id, updatedUser){
    return new Promise(function(resolve, reject){
        
        User.findOneAndUpdate({
            _id : id
        }, updatedUser).then((user)=>{
            resolve(user)
        }, (err)=>{
            reject(err)
        })
    })
}

module.exports.addPostInUser = function(post){
    return new Promise(function(resolve, reject){
        
        //if error, try 
        //var newPost = new Post(post)
        //then add var Post = mongoose.model("post", postSchema) sa taas
        
        User.findOneAndUpdate({
            username : post.user
        }, {
            $push : {posts : {post}}
        }).then((user)=>{
            resolve(user)
        }, (err)=>{
            reject(err)
        })
    })    
}

module.exports.deletePostInUser = function(uname, postId){
    return new Promise(function(resolve, reject){
        
        User.findOneAndUpdate({
            username : uname

        }, {
            $pull : {posts : {_id : postId}}
        }).then((user)=>{
            resolve(user)
        }, (err)=>{
            reject(err)
        })
    })
}

module.exports.editPostInUser = function(user, post){
    return new Promise(function(resolve, reject){
        
        User.findOneAndUpdate({
            username : user.username
        }, {
            $set: { "posts.$" : post }
        }).then((user)=>{
            resolve(user)
        }, (err)=>{
            reject(err)
        })
    })
}

module.exports.getPostByUser = function(postOwner){
    return new Promise(function(resolve, reject){
        
        User.findOne({
            username : postOwner
        }).then((user)=>{
            //TODO : filter out private posts in controller
            resolve(user.posts)
        }, (err)=>{
            reject(user)
        })
    })
}