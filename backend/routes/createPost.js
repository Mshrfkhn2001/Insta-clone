const express=require("express");
const router=express.Router();
const mongoose=require("mongoose");
const RequireLogin = require("../middlewares/RequireLogin");
const POST=mongoose.model("POST");


// Route
router.get("/allposts",RequireLogin,(req,res)=>{
  let limit=req.query.limit
    POST.find()
    .populate("postedBy","_id name photo")
    .populate("comments.postedBy","_id name")
    .limit(parseInt(limit))
    .sort("-createdAt")
    .then(posts=>res.json(posts))
    .catch(err=>console.log(err))
})

router.post("/createPost",RequireLogin,(req,res)=>{
    const {body,pic}=req.body;
    console.log(pic)
    if(!body || !pic)
    {
        return res.status(422).json({error:"please add all the fields"})
    }
    // req.user
    console.log(req.user)
    // res.json("Ok");
    const post=new POST({
        body,
        photo:pic,
        postedBy:req.user
    })
    post.save().then((result)=>{
        return res.json({post:result})
    }).catch(err=>console.log(err))
})

router.get("/myposts",RequireLogin,(req,res)=>{
    POST.find({postedBy:req.user._id})
    .populate("postedBy","_id name")
    .populate("comments.postedBy","_id name")
    .sort("-createdAt")
    .then(myposts=>{
        res.json(myposts)
    })
    // console.log(req.user)
})
router.put("/like", RequireLogin, async (req, res) => {
    try {
      const result = await POST.findByIdAndUpdate(
        req.body.postId,
        { $push: { likes: req.user._id } },
        { new: true }
      )
      .populate("postedBy","_id name photo")
      .exec();
  
      res.json(result);
    } catch (err) {
      res.status(422).json({ error: err });
    }
  })

  router.put("/unlike", RequireLogin, async (req, res) => {
    try {
      const result = await POST.findByIdAndUpdate(
        req.body.postId,
        { $pull: { likes: req.user._id } },
        { new: true }
      )
      .populate("postedBy","_id name photo")
      .exec();
  
      res.json(result);
    } catch (err) {
      res.status(422).json({ error: err });
    }
  })
  router.put("/comment", RequireLogin, async (req, res) => {
    const commentText = req.body.text.trim();
    if(!commentText)
      {
        return res.status(400).json({error:"comment cannot be empty"})
      }
    const comment = {
      comment: req.body.text,
      postedBy: req.user._id
    };
  
    try {
      const result = await POST.findByIdAndUpdate(
        req.body.postId,
        {
          $push: { comments: comment }
        },
        {
          new: true
        }
      ).populate("comments.postedBy","_id name")
      .populate("postedBy","_id name photo")
      .exec();
      res.json(result);
    } catch (err) {
      res.status(422).json({ error: err });
    }
  });
  // api to delete post
  // router.delete("/deletePost/:postId",RequireLogin,(req,res)=>{
  //   // console.log(req.params.postId)
  //   POST.findOne({id:req.params.postId})
  //   .populate("postedBy","_id")
  //   .exec((err,post)=>{
  //     if(err || post)
  //     {
  //       return res.status(422).json({error:err})
  //     }
  //     if(post.postedBy._id.toString()==req.user._id.toString())
  //     {
  //       post.remove()
  //       .then(result=>{
  //         return res.json({message:"Successfully deleted"})
  //       })
  //       .catch((err)=>{
  //         console.log(err)
  //       })
  //     }
  //   })
  // })
  router.delete("/deletePost/:postId", RequireLogin, async (req, res) => {
    try {
      const post = await POST.findOne({ _id: req.params.postId })
        .populate("postedBy", "_id")
        .exec();
  
      if (!post) {
        return res.status(422).json({ error: "Post not found" });
      }
  
      if (post.postedBy._id.toString() !== req.user._id.toString()) {
        return res.status(403).json({ error: "Unauthorized" });
      }
  
      await POST.findByIdAndDelete(req.params.postId);
      res.json({ message: "Successfully deleted" });
  
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Unable to delete post" });
    }
  });
  
  //to show following posts
  router.get("/myfollowingpost",RequireLogin,(req,res)=>{
    POST.find({
      postedBy:{
        $in:req.user.following
      }
    })
    .populate("postedBy","_id name")
    .populate("comments.postedBy","_id name")
    .then(posts=>{
      res.json(posts)
    })
    .catch(err=>{console.log(err)})
  })
  
module.exports=router