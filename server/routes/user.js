const express = require('express')
const router = express.Router()
const bcrypt=require('bcrypt');
const mongoose = require('mongoose')
const loginauth  = require('../middleware/login')
const Post =  mongoose.model("Post")
const User = mongoose.model("User")


router.get('/user/:id',loginauth,(req,res)=>{
    User.findOne({_id:req.params.id})
    .select("-password")
    .then(user=>{
         Post.find({postedBy:req.params.id})
         .populate("postedBy","_id name")
         .exec((err,posts)=>{
    if(err){
        return res.status(422).json({error:err})
    }
    console.log(posts);
    return  res.json({user,posts})
    
 })
    }).catch(err=>{
        return res.status(404).json({error:"User not found"})
    })
})
router.put('/follow',loginauth,(req,res)=>{
    User.findByIdAndUpdate(req.body.followId,{
        $push:{followers:req.user._id}
    },{
        new:true
    },(err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }
      User.findByIdAndUpdate(req.user._id,{
          $push:{following:req.body.followId}
          
      },{new:true}).select("-password").then(result=>{
          res.json(result)
      }).catch(err=>{
          return res.status(422).json({error:err})
      })

    }
    )
})
router.put('/unfollow',loginauth,(req,res)=>{
    User.findByIdAndUpdate(req.body.unfollowId,{
        $pull:{followers:req.user._id}
    },{
        new:true
    },(err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }
      User.findByIdAndUpdate(req.user._id,{
          $pull:{following:req.body.unfollowId}
          
      },{new:true}).select("-password").then(result=>{
          res.json(result)
      }).catch(err=>{
          return res.status(422).json({error:err})
      })

    }
    )
})
router.put('/editname',loginauth,(req,res)=>{
    const {email}=req.body
    User.findOne({email:email})
    .then((user)=>{
        if(!user)
        return res.status(422).json({error:"Please check your email"})
    User.findByIdAndUpdate(req.user._id,{$set:{name:req.body.name}},{new:true},
        (err,result)=>{
         if(err){
             return res.status(422).json({error:"cannot edit Name"})
         }
         res.json(result)
    })
})
})
router.put('/updatepic',loginauth,(req,res)=>{
    
    User.findByIdAndUpdate(req.user._id,{$set:{pic:req.body.pic}},{new:true},
        (err,result)=>{
         if(err){
             return res.status(422).json({error:"pic canot post"})
         }
         res.json(result)
    })
})
router.put('/editprofile',loginauth,(req,res)=>{
    const {email,password,newpassword}=req.body;
    User.findOne({email:email})
    .then((user)=>{
        if(!user)
        return res.status(422).json({error:"please check email or current password"})
        bcrypt.compare(password,user.password)
        .then(domatch=>{
            if(domatch)
            {
                console.log("matched");
                bcrypt.hash(newpassword,12).then(hashedpassword=>{
                    user.password = hashedpassword
                    user.save().then((saveduser)=>{
                        res.json({message:"password updated success"})
                    })

                 })
            }
            else
            return res.status(422).json({error:"please check email or current password"})
        })
        .catch(err=>{
         console.log(err);
        })
    })
})
router.post('/searchusers',(req,res)=>{
    let userPattern = new RegExp("^"+req.body.query)
    User.find({email:{$regex:userPattern}})
    .select("_id email")
    .then(user=>{
        res.json({user})
    }).catch(err=>{
        console.log(err)
    })

})




module.exports=router;
