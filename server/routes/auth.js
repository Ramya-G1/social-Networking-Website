const express=require('express');
const router=express.Router();
const mongoose=require('mongoose');
const User=mongoose.model('User');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const {JWT_SECRET}=require('../config/keys');
const loginauth=require("../middleware/login");
router.post('/register',(req,res)=>{
    const {name,email,password}=req.body;
    if(!email || !name || !password)
    return res.status(422).json({
        error:"plz fill all the fields"
    });
    User.findOne({email:email}).then((saveduser)=>{
        if(saveduser)
        return res.json({error:"This email already exists"})
        bcrypt.hash(password,12)
        .then(hashedpassword=>{
              const user=new User({
                name,
                email,
                password:hashedpassword,
                pic
               })
               user.save().then(user=>{
                return res.json({message:"Registered successfully"});
               }).catch(err=>{
                console.log(err);
               })
        }) 
    }).catch(err=>{
        console.log(err);
    })
})
router.post('/login',(req,res)=>{
    const{email,password}=req.body;
    if(!email ||!password)
    return res.status(422).json({error:"please fill every field"})
    User.findOne({email:email})
    .then((saveduser)=>{
        if(!saveduser)
        return res.status(422).json({error:"please check email or password"})
        bcrypt.compare(password,saveduser.password)
        .then(domatch=>{
            if(domatch)
            {
                const token=jwt.sign({_id:saveduser._id},JWT_SECRET)
                const {_id,name,email,followers,following,pic}=saveduser;
                return res.json({token,user:{_id,name,email,followers,following,pic}});
            }
            else
            return res.status(422).json({error:"please check email or password"})
        })
        .catch(err=>{
         console.log(err);
        })
    })
})
module.exports=router