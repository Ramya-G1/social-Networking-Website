const express=require('express');
const router=express.Router();
const mongoose=require('mongoose');
const User=mongoose.model('User');
const crypto=require('crypto');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const {JWT_SECRET}=require('../config/keys');
const loginauth=require("../middleware/login");
const {EMAIL,SENDGRID_API}=require('../config/keys')
const nodemailer=require('nodemailer');
const sendgridTransport=require('nodemailer-sendgrid-transport');
const transport=nodemailer.createTransport(sendgridTransport({
      auth:{
          api_key:SENDGRID_API
      }
}))
router.post('/register',(req,res)=>{
    const {name,email,password,pic}=req.body;
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
                   transport.sendMail({
                       to:user.email,
                       from:"noreplybuddy1@gmail.com",
                       subject:"Registered successfully",
                       html:"<h1>Welcome to my insta</h1>"
                   })
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
router.post('/reset-password',(req,res)=>{
    crypto.randomBytes(32,(err,buffer)=>{
        if(err){
            console.log(err)
        }
        const token = buffer.toString("hex")
        User.findOne({email:req.body.email})
        .then(user=>{
            if(!user){
                return res.status(422).json({error:"User dont exists with that email"})
            }
            user.resetToken = token
            user.expireToken = Date.now() + 3600000
            user.save().then((result)=>{
                transport.sendMail({
                    to:user.email,
                    from:"noreplybuddy1@gmail.com",
                    subject:"password reset",
                    html:
                    `<h5>click in this <a href="${EMAIL}/reset/${token}">link</a> to reset password</h5>
                    `
                })
                res.json({message:"check your email"})
            })

        })
    })
})
router.post('/newpassword',(req,res)=>{
    const newPassword = req.body.password
    const sentToken = req.body.token
    User.findOne({resetToken:sentToken,expireToken:{$gt:Date.now()}})
    .then(user=>{
        if(!user){
            return res.status(422).json({error:"Try again session expired"})
        }
        bcrypt.hash(newPassword,12).then(hashedpassword=>{
           user.password = hashedpassword
           user.resetToken = undefined
           user.expireToken = undefined
           user.save().then((saveduser)=>{
               res.json({message:"password updated success"})
           })
        })
    }).catch(err=>{
        console.log(err)
    })
})
module.exports=router
//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