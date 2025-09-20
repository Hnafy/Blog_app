import mongoose from 'mongoose'
import joi from 'joi'

let model = mongoose.Schema({
  title:{
    type:String,
    require:true,
    trim:true,
    min:2,
    max:200
  },
  description:{
    type:String,
    require:true,
    trim:true,
    min:2,
    max:50
  },
  user:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"user",
    require:true
  },
  category:{
    type:String,
    max:50,
    trim:true,
    require:true
  },
  image:{
    type:Object,
    default:{
      url:"",
      publicId:null
    }
  },
  like:[
    {
      type:mongoose.Schema.Types.ObjectId,
      ref:"user"
    }
  ],
  bookmark: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user"
    }
  ]
},{
  timestamps:true,
  toJSON: {virtuals:true},
  toObject: {virtuals:true}
})

let postModel = mongoose.model("post",model)

let validationCreatePost = (obj)=>{
  const filter = joi.object({
    title:joi.string().trim().min(3).max(50).required(),
    description:joi.string().trim().min(3).max(200).required(),
    category:joi.string().trim().max(50).required()
  })
  return filter.validate(obj)
}

let validationUpdatePost = (obj)=>{
  const filter = joi.object({
    title:joi.string().trim().min(3).max(50),
    description:joi.string().trim().min(3).max(200),
    category:joi.string().trim().max(50)
  })
  return filter.validate(obj)
}

model.virtual("comments",{
  ref:"comment",
  localField:"_id",
  foreignField:"postId"
})

export {postModel,validationCreatePost,validationUpdatePost}