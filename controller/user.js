const express = require("express")
const router = express.Router()
const crypto = require("crypto")
const User = require("../model/user")
//const Post = require("../model/post") TO BE USED 
const bodyparser = require("body-parser")

const urlencoder = bodyparser.urlencoded({
    extended: false
})
