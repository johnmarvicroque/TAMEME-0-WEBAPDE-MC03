const mongoose = require("mongoose")

var postSchema = mongoose.Schema({
    
    title : {
        type : String,
        required : true
    },
    
    url: {
        type : String,
        required : true
    }, 
    
    author : {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'user'
    },
    tags : [{type: mongoose.Schema.Types.ObjectId, ref: 'tag'}]
})

var UserSchema = mongoose.Schema({
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

var User = mongoose.model("user", UserSchema)

exports.addUser = function(user){
    return new Promise(function (resolve, reject){
        var u = new User(user)
        u.save().then((newUser) => {
            resolve(newUser)
        }, (error) => {
            reject(error)
        })
    })
}

exports.getAllUsers = function(){
    return new Promise (function(resolve, reject){
        User.find().then((users) => {
            resolve(users)
        }, (error) => {
            reject(error)
        })
    })
}

exports.getUserByUsername = function(uname){
    return new Promise (function(resolve, reject){
        User.findOne({
            username: uname
        }).then((user) => {
            resolve(user)
        }, (error) => {
            reject(error)
        })
    })
}
