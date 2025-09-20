import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDialog } from "../context/Dialog";
import { useAuth } from "../context/Auth";
import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { usePosts } from "../context/Post";

export default function Post({ post,onRemoveBookmark }) {
    let { user } = useAuth();
    let nav = useNavigate();
    let [controllers, setControllers] = useState({
        like: false,
        bookMark: false,
    });
    let {user:userProfile} = usePosts()
    let token = Cookies.get("token");
    let { setDialog, setPostId } = useDialog();
    let {pathname} = useLocation()
    // check liked post
    useEffect(() => {
        if (post.like.some((userID) => userID === user._id)) {
            setControllers((prev) => ({ ...prev, like: true }));
        }
        if (post.bookmark.some((userID) => userID === user._id)) {
            setControllers((prev) => ({ ...prev, bookMark: true }));
        }
    }, [post.bookmark, post.like, user._id]);
    
    // toggle like
    async function toggleLike() {
        try {
            let res = await axios.post(
                `${import.meta.env.VITE_BASE_URL}/post/like`,
                {
                    postId: post._id,
                },
                {
                    headers: { token: token },
                }
            );
            console.log(res.data.msg);
            setControllers((prev) => ({ ...prev, like: !prev.like }));
        } catch (err) {
            console.log(err);
        }
    }
    // toggle bookmark
    async function toggleBookmark() {
        try {
            let res = await axios.post(
                `${import.meta.env.VITE_BASE_URL}/post/bookmark`,
                {
                    postId: post._id,
                },
                {
                    headers: { token: token },
                }
            );
            console.log(res.data.msg);
            setControllers((prev) => ({ ...prev, bookMark: !prev.bookMark }));
            if (controllers.bookMark && onRemoveBookmark) {
                onRemoveBookmark(post._id);
            }
        } catch (err) {
            console.log(err);
        }
    }
    // update post
    function handleUpdate() {
        // redirect to update page with post id
        nav(`/updatePost/${post._id}`);
    }
    // delete post
    function handleDelete() {
        setPostId(post._id);
        setDialog(true);
    }
    // console.log("post",post )
    // console.log("user",user )
    // console.log("userProfile",userProfile )

    return (
        <div className="min-h-[200px] md:min-h-[300px] mt-10 bg-surface text-text border border-gray-500/20 rounded-md md:px-4 px-3 py-2">
            {/* post image */}
            <div className="group cursor-pointer w-full h-[200px] flex justify-center mb-5">
                <img
                    className="group-hover:scale-105 transition bg-cover max-h-[200px] rounded-md"
                    src={post.image.url}
                    alt={post.user.user}
                />
            </div>

            {/* post details */}
            <div className="text-sm">
                {/* user */}
                <div className="flex justify-between items-center mb-2.5 md:mb-9">
                    <Link to={`/user/${post.user?._id || post.user}`}>
                        <div className="flex items-center gap-2.5 cursor-pointer">
                            <img
                                className="bg-transparent rounded-full w-[25px] h-[25px] md:w-[50px] md:h-[50px] border-2 p-0.5 md:max-w-[50px]"
                                src={
                                    post.user.profilePhoto?.avatar ||
                                    userProfile.profilePhoto?.avatar ||
                                    "/avatar.jpg"
                                }
                                alt={userProfile.user}
                            />
                            <p className=" font-medium text-lg truncate w-full">
                                {post.user.user || userProfile?.user}
                            </p>
                        </div>
                    </Link>
                    {/* show Update button only for post owner */}

                    {((user._id === (post?.user._id || post.user)) || user.isAdmin) && (
                        <div className="flex justify-end gap-1">
                            <button
                                onClick={handleUpdate}
                                className="btn btn-primary"
                            >
                                Update
                            </button>
                            <button
                                onClick={handleDelete}
                                className="btn btn-error"
                            >
                                Delete
                            </button>
                        </div>
                    )}
                </div>

                {/* title */}
                <div className="flex justify-between items-center">
                    <h2 className="font-bold text-1xl md:text-2xl">
                        {post.title}
                    </h2>
                    <p className=" bg-accent px-2.5 py-1.5 rounded">
                        {post.category}
                    </p>
                </div>

                {/* desc */}
                <p className="text-1xl font-light mb-9">{post.description}</p>

                {/* controllers */}
                <div className="flex items-center justify-between mt-3">
                    {/* Like */}
                    <div
                        onClick={toggleLike}
                        className="flex justify-center items-center gap-1.5 cursor-pointer"
                    >
                        <p>{post.like.length + (controllers.like ? 1 : 0)}</p>
                        <i
                            className={`text-2xl fa-${
                                controllers.like ? "solid active" : "regular"
                            } fa-thumbs-up like-icon`}
                        />
                    </div>

                    {/* Bookmark */}
                    <i
                        onClick={toggleBookmark}
                        className={`text-2xl fa-${
                            controllers.bookMark ? "solid active" : "regular"
                        } fa-bookmark bookmark-icon cursor-pointer`}
                    />
                </div>
            </div>
            {!pathname.startsWith("/comment") && (
            <Link to={`/comment/${post._id}`}>
                <p className="text-center block text-cyan-500 cursor-pointer border-t-[1px] border-white mt-3 transition-colors duration-300 hover:text-cyan-200">show comments</p>
            </Link>
            )}
        </div>
    );
}
