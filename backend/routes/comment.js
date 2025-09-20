import express from 'express'
import { verifyToken } from '../middleware/auth.js'
import validateObjectId from '../middleware/validateObjectId.js'
import { createComment, deleteComment, getAllComments, getCommentById, updateComment } from '../controllers/commentController.js'

let router = express.Router()

router.route("/")
    .post(verifyToken,createComment)
    .get(getAllComments)

router.route("/:id")
    .delete(validateObjectId,verifyToken,deleteComment)
    .put(validateObjectId,verifyToken,updateComment)
    .get(validateObjectId,getCommentById)

export default router