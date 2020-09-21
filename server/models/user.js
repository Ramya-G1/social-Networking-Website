const mongoose=require('mongoose');
const { stringify } = require('query-string');
const {ObjectId}=mongoose.Schema.Types;
const userSchema=new mongoose.Schema({
    name:{
        type:String,
       required:true
    },
    password:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    resetToken :String,
    expireToken:Date,
    pic:{
        type:String,
default:"https://res.cloudinary.com/dwa4ixyyh/image/upload/v1599733784/sample.jpg"
    },
    followers:[
        {type:ObjectId,ref:"User"}
    ],
    following:[
        {type:ObjectId,ref:"User"}
    ],

})
mongoose.model('User',userSchema);