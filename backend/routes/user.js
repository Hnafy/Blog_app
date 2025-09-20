import express from "express";
import auth, { verifyToken } from "../middleware/auth.js";
import {
    deleteUser,
    getAllUsers,
    getUserById,
    getVerifyToken,
    loginUser,
    registerUser,
    updateUser,
    uploadAvatar,
} from "../controllers/userController.js";
import validateObjectId from "../middleware/validateObjectId.js";
import uploadPhoto from "../middleware/uploadPhoto.js";

const router = express.Router();

// get all users
router.route("/").get(auth,getAllUsers);
// verify user token
router.route("/verify").get(getVerifyToken);
// register user
router.route("/register").post(registerUser);
// login user
router.route("/login").post(loginUser);
// user handler
router.route("/:id")
    .get(validateObjectId, verifyToken, getUserById)
    .delete(validateObjectId, auth, deleteUser)
    .put(validateObjectId, auth, updateUser);
// upload avatar
router.route("/uploadAvatar").post(verifyToken,uploadPhoto.single("image"),uploadAvatar);

export default router;
