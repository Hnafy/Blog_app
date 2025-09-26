import userModel from "../models/usersModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import {
    cloudinaryDeleteArrayOfImage,
    cloudinaryDeleteImage,
    cloudinaryUploadImage,
} from "../cloudinary.js";
import usersModel from "../models/usersModel.js";

import { commentModel } from "../models/commentModel.js";
import { postModel } from "../models/postModel.js";
dotenv.config();

// get all users
export let getAllUsers = async (req, res) => {
    try {
        let users = await userModel.find().populate("posts");
        res.status(201).json(users);
    } catch (err) {
        res.status(500).json(err.message);
    }
};
// verify token
export let getVerifyToken = async (req, res) => {
    const token = req.headers.token;
    if (!token) return res.status(401).json({ error: "No token" });

    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
        if (err) return res.status(401).json({ error: "Invalid token" });
        res.json({ decoded, token: token }); // send back user data
    });
};

// get user by id
export let getUserById = async (req, res) => {
    try {
        let user = await userModel
            .findById(req.params.id)
            .select("-password")
            .populate({
                path: "posts",
                options: { sort: { createdAt: -1 } }, // latest first
            });

        res.status(201).json(user);
    } catch (err) {
        res.status(500).json(err.message);
    }
};

// register user
export let registerUser = async (req, res) => {
    try {
        let findEmail = await userModel.findOne({ email: req.body.email });
        if (findEmail) {
            res.status(403).send("this email is exist");
        }
        let addUser = await new userModel({
            user: req.body.user,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, 10),
        });
        let token = jwt.sign(
            { id: addUser._id, user: addUser.user, isAdmin: addUser.isAdmin },
            process.env.SECRET_KEY
        );
        await addUser.save();
        res.status(201).json({
            id: addUser._id,
            isAdmin: addUser.isAdmin,
            email: addUser.email,
            user: addUser.user,
            token: token,
        });
    } catch (err) {
        res.status(500).json(err.message);
    }
};
// login user
export let loginUser = async (req, res) => {
    try {
        let findEmail = await userModel.findOne({ email: req.body.email });
        if (!findEmail) {
            res.status(403).send("this email isn't exist");
        }
        if (bcrypt.compareSync(req.body.password, findEmail.password)) {
            const token = jwt.sign(
                {
                    id: findEmail._id,
                    user: findEmail.user,
                    isAdmin: findEmail.isAdmin,
                },
                process.env.SECRET_KEY
            );
            res.status(201).json({
                id: findEmail._id,
                isAdmin: findEmail.isAdmin,
                email: findEmail.email,
                user: findEmail.user,
                token: token,
            });
        } else {
            res.status(403).send("email or password is wrong");
        }
    } catch (err) {
        res.status(500).json(err.message);
    }
};

// delete user
export let deleteUser = async (req, res) => {
    try {
        // find user
        let findUser = await userModel.findById(req.params.id);
        if (!findUser) {
            res.status(404).send("this email isn't exist");
        }
        // delete user
        await userModel.findByIdAndDelete(req.params.id);
        // delete avatar for user
        if (findUser.profilePhoto.publicId !== null) {
            await cloudinaryDeleteImage(findUser.profilePhoto.publicId);
        }
        // delete all image for user
        let posts = await postModel.find({ userId: req.user.id });
        let publicIds = posts.map((post) => post.image.publicId);
        await cloudinaryDeleteArrayOfImage(publicIds);
        // delete post and comment for this user
        await commentModel.deleteMany({ user: findUser._id });
        await postModel.deleteMany({ user: findUser._id });
        res.status(201).send({ message: "the email had deleted successfully" });
    } catch (err) {
        res.status(500).json(err.message);
    }
};

// update user
export let updateUser = async (req, res) => {
    try {
        let existingUser = await userModel.findById(req.params.id);
        if (!existingUser) {
            return res.status(404).json("User not found");
        }

        // Build update object
        let updateFields = {
            user: req.body.user,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, 10),
            profilePhoto: existingUser.profilePhoto, // keep old photo by default
        };

        let updateUser = await userModel.findByIdAndUpdate(
            req.params.id,
            updateFields,
            { new: true }
        );

        res.status(200).json({
            updateUser,
            message: "User Updated successfully",
        });
    } catch (err) {
        res.status(500).json(err.message);
    }
};

// post avatar
export let uploadAvatar = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ msg: "Please upload an image" });
        }

        // upload photo to Cloudinary
        let result = await cloudinaryUploadImage(
            req.file.buffer,
            Date.now().toString()
        );

        // grab the user
        let user = await usersModel.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }

        // delete old avatar (if exists)
        if (user.profilePhoto?.publicId) {
            await cloudinaryDeleteImage(user.profilePhoto.publicId);
        }

        // update avatar in DB
        user.profilePhoto = {
            avatar: result.secure_url,
            publicId: result.public_id,
        };
        await user.save();

        // response
        res.status(201).json({
            msg: "Avatar uploaded successfully",
            avatar: result.secure_url,
            publicId: result.public_id,
        });
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
};
