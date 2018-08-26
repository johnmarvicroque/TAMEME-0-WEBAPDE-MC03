const mongoose = require("mongoose")
const {User} = require("post.js")

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