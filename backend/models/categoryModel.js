import Joi from 'joi'
import mongoose from 'mongoose'

let schema = mongoose.Schema({
  userId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"user",
    required:true
  },
  title:{
    type:String,
    required:true,
  }
},{timestamps:true})
let categoryModel = mongoose.model("category",schema)

let validateCreateCategory = (obj)=>{
  const schema = Joi.object({
    title:Joi.string().trim().required()
  })
  return schema.validate(obj)
}


export {categoryModel,validateCreateCategory}