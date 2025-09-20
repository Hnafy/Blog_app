import express from 'express'
import auth, { verifyToken } from '../middleware/auth.js'
import validateObjectId from '../middleware/validateObjectId.js'
import { createCategory, deleteCategory, getAllCategories } from '../controllers/categoryController.js'

let router = express.Router()

router.route("/")
    .post(auth,createCategory)
    .get(getAllCategories)

router.route("/:id")
    .delete(validateObjectId,verifyToken,deleteCategory)


export default router