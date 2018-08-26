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


var Tag = mongoose.model("tag", tagSchema)