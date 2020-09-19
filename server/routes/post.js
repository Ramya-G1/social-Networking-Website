const express=require('express');
const router=express.Router();
const mongoose=require('mongoose');
const Post =mongoose.model("Post");
const loginauth=require("../middleware/login");
router.get('/allposts',(req,res)=>{
    Post.find()
    .populate("postedBy","_id name")
    .populate("comments.postedBy","_id name")
        .then(posts=>{
        return res.json({posts})
    })
    .catch(error=>{
        console.log(error);
    })
})
router.get('/mypost',loginauth,(req,res)=>{
    Post.find({postedBy:req.user._id})
    .populate("postedBy","_id name")
    .then(post=>{
        return res.json({post})
    })
    .catch(error=>{
    console.log(error)
});
})
router.post('/createpost',loginauth,(req,res)=>{
    const {title,body,pic}=req.body;
    console.log(title,body,pic);
    if(!title|| !body || !pic)
    return res.json({error:"fill the fields"});
       req.user.password=undefined;
       console.log(req.user);
    const post=new Post({
        title,
        body,
        photo:pic,
        postedBy:req.user
    })
    post.save().then(result=>{
        res.json({post:result})
    }).catch(error=>{
        console.log(error)
    })
})
    router.put('/like',loginauth,(req,res)=>{
        Post.findByIdAndUpdate(req.body.postId,{
            $push:{likes:req.user._id}
        },{
            new:true
        })
        .populate("postedBy","_id name")
        .populate("comments.postedBy","_id name")
        .exec((err,result)=>{
            if(err){
                return res.status(422).json({error:err})
            }else{
                res.json(result)
            }
        })
    })
    router.get('/getsubspost',loginauth,(req,res)=>{
        Post.find({postedBy:{$in:req.user.following}})
        .populate("postedBy","_id name")
        .populate("comments.postedBy","_id name")
        .then(posts=>{
            res.json({posts})
        })
        .catch(err=>{
            console.log(err)
        })
    })
    router.put('/unlike',loginauth,(req,res)=>{
        Post.findByIdAndUpdate(req.body.postId,{
            $pull:{likes:req.user._id}
        },{
            new:true
        })
        .populate("postedBy","_id name")
        .populate("comments.postedBy","_id name")
        .exec((err,result)=>{
            if(err){
                return res.status(422).json({error:err})
            }else{
                res.json(result)
            }
        })
    })
    router.put('/postcomment',loginauth,(req,res)=>{
        const comment={
            text:req.body.text,
            postedBy:req.user._id
        }
        Post.findByIdAndUpdate(req.body.postId,{
            $push:{comments:comment}
        },{
            new:true
        })
        .populate("postedBy","_id name")
       .populate("comments.postedBy","_id name")
        .exec((err,result)=>{
            if(err){
                return res.status(422).json({error:err})
            }else{
                res.json(result)
            }
        })
    })
    router.delete('/deletepost/:postId',loginauth,(req,res)=>{
        Post.findOne({_id:req.params.postId})
        .populate("postedBy","_id")
        .exec((err,post)=>{
            if(err || !post){
                return res.status(422).json({error:err})
            }
            if(post.postedBy._id.toString() === req.user._id.toString()){
                  post.remove()
                  .then(result=>{
                      res.json(result)
                  }).catch(err=>{
                      console.log(err)
                  })
            }
        })
    })
    router.delete('/deletecomment/:id/:comment_id',loginauth,(req,res)=>{
        const comment = { _id: req.params.comment_id };
        Post.findByIdAndUpdate(
        req.params.id,
       {
         $pull: { comments: comment },
        },{
            new:true
        })
        .populate("postedBy","_id name")
       .populate("comments.postedBy","_id name")
        .exec((err,result)=>{
            if(err || !result){
                return res.status(422).json({error:err})
            }else{
                res.json(result)
            }
        })
    })
    module.exports =router