import { useEffect, useState } from "react";
import Post from "../components/Post";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../context/Auth";
import Cookies from "js-cookie";
import { useLoading } from "../context/Loading";
import UpdateCommentDialog from "../components/updateCommentDialog";
import { useAlert } from "../context/Alert";

export default function Comment() {
    let [comments, setComments] = useState([]);
    let [post, setPost] = useState(null);
    let { id: postId } = useParams();
    let { user } = useAuth();
    let [input, setInput] = useState("");
    let token = Cookies.get("token");
    let { setLoading } = useLoading();
    const [isOpen, setIsOpen] = useState(false);
    const [comment, setComment] = useState({});
    let {setAlert} = useAlert()

    // get comments
    useEffect(() => {
        async function fetchData() {
            try {
                let res = await axios.get(
                    `${import.meta.env.VITE_BASE_URL}/comment`
                );
                setComments(res.data.filter((post) => post.postId == postId));
            } catch (err) {
                console.log(err);
            }
        }
        fetchData();
    }, [postId]);
    // get post
    useEffect(() => {
        async function fetchData() {
            try {
                let res = await axios.get(
                    `${import.meta.env.VITE_BASE_URL}/post/${postId}`
                );
                setPost(res.data);
            } catch (err) {
                console.log(err);
            }
        }
        fetchData();
    }, [postId]);
    // update comment
    async function handleUpdate(newTitle) {
        try {
            setLoading(true);

            let res = await axios.put(
                `${import.meta.env.VITE_BASE_URL}/comment/${comment.id}`,
                { title: newTitle },
                {
                    headers: {
                        token: token,
                    },
                }
            );

            setComments((prevComments) =>
                prevComments.map((myComment) =>
                    myComment._id === comment.id ? res.data.createComment : myComment
                )
            );

            setAlert({
                    visible: true,
                    type: "success",
                    message: res.data.msg,
                });
            setIsOpen(false);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    }
    // delete comment
    async function handleDelete(commentId) {
        try {
            setLoading(true);
            let res = await axios.delete(
                `${import.meta.env.VITE_BASE_URL}/comment/${commentId}`,
                {
                    headers: {
                        token: token,
                    },
                }
            );
            setComments((prevComments) =>
                prevComments.filter((comment) => comment._id !== commentId)
            );
            setAlert({
                    visible: true,
                    type: "danger",
                    message: res.data.msg,
                });
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    }
    // create comment
    async function sendComment() {
        try {
            setLoading(true);
            let res = await axios.post(
                `${import.meta.env.VITE_BASE_URL}/comment`,
                { postId: postId, title: input },
                {
                    headers: {
                        token: token,
                    },
                }
            );
            setComments((prevComments) => [
                ...prevComments,
                res.data.createComment,
            ]);
            setAlert({
                    visible: true,
                    type: "success",
                    message: res.data.msg,
                });
            setInput("");
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    }
    return (
        <>
            <div className="w-full flex flex-col items-center">
                <div className="min-h-[200px] w-[424px] flex flex-col gap-2.5 md:min-h-[300px] bg-surface text-text border border-gray-500/20 rounded-md md:px-4 px-3 py-2">
                    {post && <Post post={post} />}

                    {comments.map((comment) => (
                        <div
                            className="flex w-full border-b-2 flex-col gap-1.5 justify-center"
                            key={comment._id}
                        >
                            {/* user details */}
                            <div className="flex items-center justify-between">
                                <Link to={`/user/${comment.userId?._id}`}>
                                    <div className="flex items-center gap-2.5 cursor-pointer">
                                        <img
                                            className="bg-transparent rounded-full w-[25px] h-[25px] md:w-[50px] md:h-[50px] border-2 p-0.5 md:max-w-[50px]"
                                            src={
                                                comment.userId.profilePhoto
                                                    ?.avatar || "/avatar.jpg"
                                            }
                                            alt={comment.userId.user}
                                        />
                                        <p className=" font-medium text-lg truncate w-full">
                                            {comment.userId.user}
                                        </p>
                                    </div>
                                </Link>
                                {/* show Update button only for post owner */}
                                {user.id === comment?.userId._id || user.isAdmin && (
                                    <div className="flex justify-end gap-1">
                                        <button
                                            onClick={() => {
                                                setIsOpen(true);
                                                setComment({id:comment._id,title:comment.title});
                                            }}
                                            className="btn btn-primary"
                                        >
                                            Update
                                        </button>
                                        <button
                                            onClick={() =>
                                                handleDelete(comment._id)
                                            }
                                            className="btn btn-error"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                )}
                            </div>
                            {/* comment details */}
                            <div>
                                <h2>{comment.title}</h2>
                            </div>
                        </div>
                    ))}
                    {/* create comment */}
                    <div className="flex bg-transparent mb-2.5 h-12 w-full max-w-md items-center gap-2 overflow-hidden rounded-full border border-gray-500/30">
                        <input
                            onChange={(e) => setInput(e.target.value)}
                            value={input}
                            type="text"
                            placeholder="create comment"
                            className="h-full bg-transparent w-full pl-6 text-sm placeholder-gray-500 outline-none"
                            required
                        />
                        <button
                            type="submit"
                            onClick={() => sendComment()}
                            className=" cursor-pointer mr-1 h-10 w-56 rounded-full bg-indigo-500 text-sm text-white transition active:scale-95"
                        >
                            Send
                        </button>
                    </div>
                </div>
            </div>
            <UpdateCommentDialog
                open={isOpen}
                initialTitle={comment.title}
                onClose={() => setIsOpen(false)}
                onUpdate={handleUpdate}
            />
        </>
    );
}
