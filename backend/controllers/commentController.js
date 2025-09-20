import { commentModel, validateCreateComment, validateUpdateComment } from "../models/commentModel.js"
import { postModel } from "../models/postModel.js"
import usersModel from "../models/usersModel.js"

// create comment
let createComment = async(req,res)=>{
  try{
    const {error} = validateCreateComment(req.body)
    if(error){
      res.status(404).send({msg:error.details[0].message})
    }
    let post = await postModel.findById({_id:req.body.postId})
    if(!post){
      res.status(404).send({msg:"post not found"})
    }
    let profile = await usersModel.findById({_id:req.user.id})
    let createComment = await commentModel.create({
      postId:req.body.postId,
      title:req.body.title,
      userId:req.user.id,
      userName:profile.user
    })
    // populate userId before sending back
    let populatedComment = await createComment.populate("userId"); 
    
    res.status(200).send({
      createComment: populatedComment,
      msg: "comment created successfully"
    });
  }catch(err){
    res.status(500).send(err)
  }
}
// get all comments
let getAllComments = async(req,res)=>{
  try{
    let getComments = await commentModel.find().populate("userId").sort({createdAt:-1})
    res.status(200).json(getComments)
  }catch(err){
    res.status(500).send(err)
  }
}
// get comment by id
let getCommentById = async(req,res)=>{
  try{
    let getComment = await commentModel.findById(req.params.id).populate("userId",["-password"]).populate("postId").sort({createdAt:-1})
    res.status(200).json(getComment)
  }catch(err){
    res.status(500).send(err)
  }
}
// delete comment
let deleteComment = async(req,res)=>{
  try{
    let comment = await commentModel.findById(req.params.id)
    if(!comment){
      res.status(404).send({msg:"post not found"})
    }
    if(req.user.id == comment.userId.toString() || req.user.isAdmin){
      let deleteComment = await commentModel.findByIdAndDelete(req.params.id)
      res.status(200).send({deleteComment,msg:"comment Deleted successfully"})
    }else{
      res.status(403).send({msg:"you not allowed"})
    }
  }catch(err){
    res.status(500).send(err)
  }
}
// update comment
let updateComment = async(req,res)=>{
  try{
    const {error} = validateUpdateComment(req.body)
    if(error){
      res.status(404).send({msg:error.details[0].message})
    }
    let comment = await commentModel.findById(req.params.id)
    if(!comment){
      res.status(404).send({msg:"comment not found"})
    }
    if(req.user.id == comment.userId.toString()){
      let createComment = await commentModel.findByIdAndUpdate(req.params.id,{
        $set:{
          title:req.body.title,
        }
      },{new:true})
      let populatedComment = await createComment.populate("userId"); 
    res.status(200).send({
      createComment: populatedComment,
      msg: "comment updated successfully"
    });
    }else{
      res.status(403).send({msg:"you not allowed"})
    }
  }catch(err){
    res.status(500).send(err)
  }
}


export {createComment,getAllComments,deleteComment,updateComment,getCommentById}

