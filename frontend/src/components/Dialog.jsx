import { useDialog } from "../context/Dialog";
import axios from "axios";
import Cookies from "js-cookie";
import { useLoading } from "../context/Loading";
import { usePosts } from "../context/Post";
import { useLocation } from "react-router-dom";
import { useAlert } from "../context/Alert";

export default function Dialog() {
    let { dialog, setDialog, postId } = useDialog();
    let { setUser } = usePosts();
    let token = Cookies.get("token");
    let { setLoading } = useLoading();
    let {posts,setPosts} = usePosts()
    const location = useLocation();
    let {setAlert} = useAlert()
    async function handleDeleteConfirm() {
        console.log(postId);
        try {
            setLoading(true);
            let res = await axios.delete(
                `${import.meta.env.VITE_BASE_URL}/post/${postId}`,
                {
                    headers: { token: token },
                }
            );
            console.log(res.data.msg);
            setAlert({
                    visible: true,
                    type: "success",
                    message: res.data.msg,
                });
            if(location.pathname.startsWith("/user/")){
                setUser((prevUser) => ({
                    ...prevUser, // keep all user data
                    posts: prevUser.posts.filter((post) => post._id !== postId),
                }));
            }else{
                console.log(posts)
                setPosts(prevPosts => prevPosts.filter(post => post._id !== postId));
            }
        } catch (err) {
            console.log(err.response.message);
        } finally {
            setLoading(false);
        }
        setDialog(false);
    }
    return (
        <>
            <div
                className={`fixed inset-0 flex justify-center items-center backdrop-blur-[1px] bg-[oklch(0.83_0_0_/_0.22)] transition-opacity duration-300 
      ${dialog ? "opacity-100 visible" : "opacity-0 invisible"}`}
            >
                <div
                    className={`flex flex-col items-center bg-white shadow-md rounded-xl py-6 px-5 md:w-[460px] w-[370px] border border-gray-200 transform transition-all duration-300
        ${
            dialog
                ? "scale-100 translate-y-0 opacity-100"
                : "scale-95 translate-y-4 opacity-0"
        }`}
                >
                    {/* Icon */}
                    <div className="flex items-center justify-center p-4 bg-red-100 rounded-full">
                        <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                        >
                            <path
                                d="M2.875 5.75h1.917m0 0h15.333m-15.333 0v13.417a1.917 1.917 0 0 0 1.916 1.916h9.584a1.917 1.917 0 0 0 1.916-1.916V5.75m-10.541 0V3.833a1.917 1.917 0 0 1 1.916-1.916h3.834a1.917 1.917 0 0 1 1.916 1.916V5.75m-5.75 4.792v5.75m3.834-5.75v5.75"
                                stroke="#DC2626"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </div>

                    {/* Title & Text */}
                    <h2 className="text-gray-900 font-semibold mt-4 text-xl">
                        Are you sure?
                    </h2>
                    <p className="text-sm text-gray-600 mt-2 text-center">
                        Do you really want to continue? This action
                        <br />
                        cannot be undone.
                    </p>

                    {/* Buttons */}
                    <div className="flex items-center justify-center gap-4 mt-5 w-full">
                        <button
                            onClick={() => setDialog(false)}
                            type="button"
                            className="w-full cursor-pointer md:w-36 h-10 rounded-md border border-gray-300 bg-white text-gray-600 font-medium text-sm hover:bg-gray-100 active:scale-95 transition"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() => handleDeleteConfirm()}
                            type="button"
                            className="w-full cursor-pointer md:w-36 h-10 rounded-md text-white bg-red-600 font-medium text-sm hover:bg-red-700 active:scale-95 transition"
                        >
                            Confirm
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
