const express=require("express");
const router=express.Router();
const mongoose=require("mongoose");
const POST=mongoose.model("POST");
const USER=mongoose.model("USER");
const requireLogin=require("../middlewares/RequireLogin");

//to get user profile
router.get("/user/:id", async (req, res) => {
    try {
      const user = await USER.findOne({ _id: req.params.id }).select("-password");
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
  
      const posts = await POST.find({ postedBy: req.params.id })
        .populate("postedBy", "_id")
        .exec();
  
      res.status(200).json({ user, posts });
    } catch (err) {
      console.error(err);
      res.status(422).json({ error: err.message });
    }
  });

  //to follow user
  router.put("/follow", requireLogin, async (req, res) => {
    try {
        // Update the follower's list of the user being followed
        let updatedUser = await USER.findByIdAndUpdate(
            req.body.followId,
            { $push: { followers: req.user._id } },
            { new: true }
        );
        
        if (!updatedUser) {
            return res.status(422).json({ error: 'User to follow not found' });
        }

        // Update the following list of the current user
        updatedUser = await USER.findByIdAndUpdate(
            req.user._id,
            { $push: { following: req.body.followId } },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(422).json({ error: 'Current user not found' });
        }

        res.json(updatedUser);
    } catch (err) {
        res.status(422).json({ error: err });
    }
});


  // router.put("/follow",requireLogin,(req,res)=>{
  //   USER.findByIdAndUpdate(req.body.followId,{
  //     $push:{followers:req.user._id}
  //   },{
  //     new:true
  //   },(err,result)=>{
  //     if(err)
  //     {
  //       return res.status(422).json({error:err})
  //     }
  //     USER.findByIdAndUpdate(req.user._id,{
  //       $push:{following:req.body.followId}
  //     },{
  //       new:true
  //     })
  //     .then(result=>res.json(result))
  //     .catch(err=>{return res.status(422).json({error:err})})
  //   }
  // )
  // })
  
  //to unfollow user

  router.put("/unfollow", requireLogin, async (req, res) => {
    try {
        // Update the follower's list of the user being unfollowed
        let updatedUser = await USER.findByIdAndUpdate(
            req.body.followId,
            { $pull: { followers: req.user._id } },
            { new: true }
        );
        
        if (!updatedUser) {
            return res.status(422).json({ error: 'User to unfollow not found' });
        }

        // Update the following list of the current user
        updatedUser = await USER.findByIdAndUpdate(
            req.user._id,
            { $pull: { following: req.body.followId } },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(422).json({ error: 'Current user not found' });
        }

        res.json(updatedUser);
    } catch (err) {
        res.status(422).json({ error: err.message });
    }
});


  // router.put("/unfollow",requireLogin,(req,res)=>{
  //   USER.findByIdAndUpdate(req.body.followId,{
  //     $pull:{followers:req.user._id}
  //   },{
  //     new:true
  //   },(err,result)=>{
  //     if(err)
  //     {
  //       return res.status(422).json({error:err})
  //     }
  //     USER.findByIdAndUpdate(req.user._id,{
  //       $pull:{following:req.body.followId}
  //     },{
  //       new:true
  //     })
  //     .then(result=>res.json(result))
  //     .catch(err=>{return res.status(422).json({error:err})})
  //   }
  // )
  // })

  //to upload profile pic

  router.put("/uploadProfilePic", requireLogin, async (req, res) => {
    try {
      // if (!req.body.pic) {
      //   return res.status(400).json({ error: 'No file uploaded' });
      // }
  
      // Update user's Photo field with the uploaded file data
      const updatedUser = await USER.findByIdAndUpdate(req.user._id, { $set: { photo: req.body.pic } }, { new: true });
  
      if (!updatedUser) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      res.json(updatedUser);
      // console.log("done")
      console.log(req.body.pic)
    } catch (err) {
      console.error('Error in uploading profile pic:', err);
      res.status(422).json({ error: err.message });
    }
  });

  // router.put("/uploadProfilePic",requireLogin,(req,res)=>{
  //   USER.findByIdAndUpdate(req.user._id,{
  //     $set:{Photo:req.body.pic}
  //   },{
  //     new:true
  //   }).exec((err,result)=>{
  //     if(err)
  //     {
  //       return res.status(422).json({error:err})
  //     }
  //     else
  //     {
  //       res.json(result)
  //     }
  //   })
  // })
module.exports=router;