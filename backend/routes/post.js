import express from 'express'
import auth, { verifyToken } from '../middleware/auth.js'
import uploadPhoto from '../middleware/uploadPhoto.js'
import { createPost, deletePost, getPostById, getPostCount, getPosts, getUserBookmark, toggleBookmark, toggleLike, updatePhoto, updatePost } from '../controllers/postController.js'
import validateObjectId from '../middleware/validateObjectId.js'

let router = express.Router()

router.route("/")
    .post(verifyToken,uploadPhoto.single("image"),createPost)
    .get(getPosts)

router.route("/count")
    .get(getPostCount)

    router.route("/like")
        .post(verifyToken,toggleLike)
    
    router.route("/bookmark")
        .post(verifyToken,toggleBookmark)

    router.route("/userBookMark")
        .get(verifyToken,getUserBookmark)

router.route("/:id")
    .get(validateObjectId,getPostById)
    .delete(validateObjectId,verifyToken,deletePost)
    .put(validateObjectId,verifyToken,updatePost)


router.route("/updatePhoto/:id")
    .put(validateObjectId,verifyToken,uploadPhoto.single("image"),updatePhoto)

export default router