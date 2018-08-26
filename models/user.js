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