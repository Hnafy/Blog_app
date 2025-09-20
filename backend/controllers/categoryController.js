import { categoryModel, validateCreateCategory } from "../models/categoryModel.js"


let createCategory = async(req,res)=>{
  try{
    let {error} = validateCreateCategory(req.body)
    if (error) return res.status(400).json(error.details[0].message)
    let result = await categoryModel.create({
      title:req.body.title,
      userId:req.user.id
    })
    res.status(201).send(result)
  }catch(err){
    res.status(500).json(err)
  }
}

let getAllCategories = async(req,res)=>{
  try{
    let result = await categoryModel.find()
    res.status(201).json(result)
  }catch(err){
    res.status(500).json(err)
  }
}

let deleteCategory = async(req,res)=>{
  try{
    if(req.user.isAdmin){
      await categoryModel.findByIdAndDelete(req.params.id)
      res.status(201).send({msg:"category deleted successfully"})
    }else{
      res.status(403).send({msg:"you not authorized"})
    }
  }catch(err){
    res.status(500).send(err)
  }
}

export {createCategory,getAllCategories,deleteCategory}