import { cloudinaryDeleteImage, cloudinaryUploadImage } from "../cloudinary.js"
import { commentModel } from "../models/commentModel.js"
import { postModel, validationCreatePost, validationUpdatePost } from "../models/postModel.js"
import cleanUploads from "../uploads/cleanUploads.js"


// create post
let createPost = async(req,res)=>{
  try{
    // check image
    if(!req.file){
      res.status(404).send({msg:"no provided photo"})
    }
    // validate inputs
    let {error} = validationCreatePost(req.body)
    if(error){
      res.status(404).send({msg:error.details[0].message})
    }
    // upload to cloudinary
    let result = await cloudinaryUploadImage(req.file.filename)
    // save in db
    let storagePost = await postModel.create({
      title:req.body.title,
      description:req.body.description,
      user:req.user.id,
      category:req.body.category,
      image:{
        url:result.secure_url,
        publicId:req.file.filename
      }
    })
    // show response to clint
    res.status(201).json(storagePost)
    // delete photo in my server
    cleanUploads(req.file.filename)
  }catch(err){
    res.status(500).send({msg:err})
  }
}
// get posts
let getPosts = async(req,res)=>{
  let postLimit = 4
  let {pageNumber,category} = req.query
  let posts;
  if(pageNumber){
    posts = await postModel.find().skip((pageNumber - 1)*postLimit).limit(postLimit).sort({createdAt:-1}).populate("user")
  }else if(category){
    posts = await postModel.find({category}).sort({createdAt:-1}).populate("user")
  }else{
    posts = await postModel.find().sort({createdAt:-1}).populate("user")
  }
  res.status(201).json(posts)
}
// get post count
let getPostCount = async(req,res)=>{
  try{
    let postCount = await postModel.countDocuments();
    res.status(201).json({count:postCount})
  }catch(err){
    res.status(500).send(err)
  }
}
// get post by id
let getPostById = async(req,res)=>{
  try{
    let post = await postModel.findById(req.params.id)
    res.status(201).json(post)
  }catch(err){
    res.status(404).send({msg:"post not found"})
  }
}
// delete post
let deletePost = async(req,res)=>{
  try{
    // grab post
    let post = await postModel.findById(req.params.id)
    if(req.user.isAdmin || req.user.id == post.user.toString()){
      // delete in db
      await postModel.findByIdAndDelete(req.params.id)
      // delete image in cloudinary
      await cloudinaryDeleteImage(post.image.publicId)
      // delete comment post
      await commentModel.deleteMany({postId:post._id})
      // show deleted post
      res.status(201).json({post,msg:"post deleted successfully"})
    }else{
      res.status(403).send("unauthorized")
    }
  }catch(err){
    res.status(404).send({msg:err.message})
  }
}
// update post
let updatePost = async(req,res)=>{
  try{
    // validate inputs
    let {error} = validationUpdatePost(req.body)
    if(error){
      return res.status(404).send({msg:error.details[0].message})
    }
    // get post
    let post = await postModel.findById(req.params.id)
    if(!post){
      return res.status(404).send({msg:"post not found"})
    }
    // authorization
    if(req.user.id !== post.user.toString()){
      return res.status(403).send({msg:"you are not allowed"})
    }
    // save in db
    let updatePost = await postModel.findByIdAndUpdate(req.params.id,{
      $set:{
        title:req.body.title,
        description:req.body.description,
        category:req.body.category,
      }
    },{new:true})
    // show response to clint
    res.status(201).json(updatePost)
  }catch(err){
    res.status(500).send({msg:err.message})
  }
}
// update post image
let updatePhoto = async(req,res)=>{
  try{
    // validate inputs
    if(!req.file){
      return res.status(404).send({msg:"please,upload a photo"})
    }
    // get post
    let post = await postModel.findById(req.params.id)
    if(!post){
      return res.status(404).send({msg:"post not found"})
    }
    // authorization
    if(req.user.id !== post.user.toString()){
      return res.status(403).send({msg:"you are not allowed"})
    }
    // delete old photo
    await cloudinaryDeleteImage(post.image.publicId)
    // upload to cloudinary
    let result = await cloudinaryUploadImage(req.file.filename)
    // save in db
    let updatePost = await postModel.findByIdAndUpdate(req.params.id,{
      $set:{
        image:{
          url:result.secure_url,
          publicId:req.file.filename
        }
      }
    },{new:true})
    // show response to clint
    res.status(201).json(updatePost)
    // delete photo in my server
    cleanUploads(req.file.filename)
  }catch(err){
    res.status(500).send({msg:err.message})
  }
}
// toggle like
let toggleLike = async (req, res) => {
  try {
    let post = await postModel.findById(req.body.postId).populate("user", ["-password"]);
    if (!post) return res.status(404).send({ msg: "this post is not found" });
    let likes = post.like;
    let isUserLiked = likes.find(
      (like) => like.toString() === req.user.id
    );
    if (isUserLiked) {
      // Remove like
      post.like = likes.filter(
        (like) => like.toString() !== req.user.id
      );
      await post.save();
      return res.status(200).send({msg: "remove like" });
    } else {
      // Add like
      post.like.push(req.user.id);
      await post.save();
      return res.status(200).send({msg: "add like" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({ msg: "server error" });
  }
};
// toggle bookmark
const toggleBookmark = async (req, res) => {
  const postId = req.body.postId;
  const userId = req.user.id;

  let post = await postModel.findById(postId);
  if (!post) return res.status(404).json({ message: "Post not found" });

  const isBookmarked = post.bookmark.includes(userId);
  
  if (isBookmarked) {
    post.bookmark = post.bookmark.filter(id => id.toString() !== userId.toString());
    await post.save();
  } else {
    post.bookmark.push(userId);
    await post.save();
  }

  res.json({ msg: isBookmarked ? "Bookmark removed" : "Bookmark added" });
};

// get user bookmark
const getUserBookmark = async (req, res) => {
  const userId = req.user.id;

  let posts = await postModel.find({bookmark:userId}).sort({createdAt:-1});
  if (posts.length == 0) return res.status(404).json({ message: "you don't have any bookmark" });


  res.json(posts);
};


export {createPost,getPosts,getPostById,getPostCount,deletePost,updatePost,updatePhoto,toggleLike,toggleBookmark,getUserBookmark}