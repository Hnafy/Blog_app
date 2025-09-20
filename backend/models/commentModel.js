import Joi from 'joi'
import mongoose from 'mongoose'

let schema = mongoose.Schema({
  postId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"post",
    required:true
  },
  userId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"user",
    required:true
  },
  title:{
    type:String,
    required:true,
  },
  userName:{
    type:String,
    required:true
  }
},{timestamps:true})
let commentModel = mongoose.model("comment",schema)

let validateCreateComment = (obj)=>{
  const schema = Joi.object({
    postId:Joi.string().required(),
    title:Joi.string().trim().required()
  })
  return schema.validate(obj)
}
let validateUpdateComment = (obj)=>{
  const schema = Joi.object({
    title:Joi.string().trim().required()
  })
  return schema.validate(obj)
}

export {commentModel,validateCreateComment,validateUpdateComment}