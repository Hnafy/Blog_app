import { cloudinaryDeleteImage, cloudinaryUploadImage } from "../cloudinary.js";
import { commentModel } from "../models/commentModel.js";
import {
    postModel,
    validationCreatePost,
    validationUpdatePost,
} from "../models/postModel.js";

// create post
let createPost = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ msg: "No provided photo" });
        }

        // validate inputs
        let { error } = validationCreatePost(req.body);
        if (error) {
            return res.status(400).json({ msg: error.details[0].message });
        }

        // upload to cloudinary
        let result = await cloudinaryUploadImage(
            req.file.buffer,
            Date.now().toString()
        );

        // save in db
        let storagePost = await postModel.create({
            title: req.body.title,
            description: req.body.description,
            user: req.user.id,
            category: req.body.category,
            image: {
                url: result.secure_url,
                publicId: result.public_id, // ✅ use Cloudinary's public_id
            },
        });

        res.status(201).json(storagePost);
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
};
// get posts
let getPosts = async (req, res) => {
    let postLimit = 4;
    let { pageNumber, category } = req.query;
    let posts;
    if (pageNumber) {
        posts = await postModel
            .find()
            .skip((pageNumber - 1) * postLimit)
            .limit(postLimit)
            .sort({ createdAt: -1 })
            .populate("user");
    } else if (category) {
        posts = await postModel
            .find({ category })
            .sort({ createdAt: -1 })
            .populate("user");
    } else {
        posts = await postModel.find().sort({ createdAt: -1 }).populate("user");
    }
    res.status(201).json(posts);
};
// get post count
let getPostCount = async (req, res) => {
    try {
        let postCount = await postModel.countDocuments();
        res.status(201).json({ count: postCount });
    } catch (err) {
        res.status(500).send(err);
    }
};
// get post by id
let getPostById = async (req, res) => {
    try {
        let post = await postModel.findById(req.params.id);
        res.status(201).json(post);
    } catch (err) {
        res.status(404).send({ msg: "post not found" });
    }
};
// delete post
let deletePost = async (req, res) => {
    try {
        let post = await postModel.findById(req.params.id);
        if (!post) return res.status(404).json({ msg: "Post not found" });

        if (req.user.isAdmin || req.user.id == post.user.toString()) {
            await postModel.findByIdAndDelete(req.params.id);
            await commentModel.deleteMany({ postId: post._id });

            // delete image from cloudinary
            if (post.image?.publicId) {
                await cloudinaryDeleteImage(post.image.publicId);
            }

            res.status(200).json({ post, msg: "Post deleted successfully" });
        } else {
            res.status(403).json({ msg: "Unauthorized" });
        }
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
};
// update post
let updatePost = async (req, res) => {
    try {
        // validate inputs
        let { error } = validationUpdatePost(req.body);
        if (error) {
            return res.status(404).send({ msg: error.details[0].message });
        }
        // get post
        let post = await postModel.findById(req.params.id);
        if (!post) {
            return res.status(404).send({ msg: "post not found" });
        }
        // authorization
        if (req.user.id !== post.user.toString()) {
            return res.status(403).send({ msg: "you are not allowed" });
        }
        // save in db
        let updatePost = await postModel.findByIdAndUpdate(
            req.params.id,
            {
                $set: {
                    title: req.body.title,
                    description: req.body.description,
                    category: req.body.category,
                },
            },
            { new: true }
        );
        // show response to clint
        res.status(201).json(updatePost);
    } catch (err) {
        res.status(500).send({ msg: err.message });
    }
};
// update post image
let updatePhoto = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ msg: "Please upload a photo" });
        }

        let post = await postModel.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ msg: "Post not found" });
        }

        if (req.user.id !== post.user.toString()) {
            return res.status(403).json({ msg: "You are not allowed" });
        }

        // delete old photo
        if (post.image?.publicId) {
            await cloudinaryDeleteImage(post.image.publicId);
        }

        // upload new one
        let result = await cloudinaryUploadImage(
            req.file.buffer,
            Date.now().toString()
        );

        let updated = await postModel.findByIdAndUpdate(
            req.params.id,
            {
                $set: {
                    image: {
                        url: result.secure_url,
                        publicId: result.public_id, // ✅ correct Cloudinary id
                    },
                },
            },
            { new: true }
        );

        res.status(200).json(updated);
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
};
// toggle like
let toggleLike = async (req, res) => {
    try {
        let post = await postModel
            .findById(req.body.postId)
            .populate("user", ["-password"]);
        if (!post)
            return res.status(404).send({ msg: "this post is not found" });
        let likes = post.like;
        let isUserLiked = likes.find((like) => like.toString() === req.user.id);
        if (isUserLiked) {
            // Remove like
            post.like = likes.filter((like) => like.toString() !== req.user.id);
            await post.save();
            return res.status(200).send({ msg: "remove like" });
        } else {
            // Add like
            post.like.push(req.user.id);
            await post.save();
            return res.status(200).send({ msg: "add like" });
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
        post.bookmark = post.bookmark.filter(
            (id) => id.toString() !== userId.toString()
        );
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

    let posts = await postModel
        .find({ bookmark: userId })
        .sort({ createdAt: -1 });
    if (posts.length == 0)
        return res.status(404).json({ message: "you don't have any bookmark" });

    res.json(posts);
};

export {
    createPost,
    getPosts,
    getPostById,
    getPostCount,
    deletePost,
    updatePost,
    updatePhoto,
    toggleLike,
    toggleBookmark,
    getUserBookmark,
};
