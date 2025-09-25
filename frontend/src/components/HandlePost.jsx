import axios from "axios";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useLocation, useNavigate } from "react-router-dom";
import { useLoading } from "../context/Loading";
import { usePosts } from "../context/Post";
import { useAlert } from "../context/Alert";

export default function HandlePost() {
    let [input, setInput] = useState({
        title: "",
        description: "",
        category: "",
        image: null,
    });
    let {setAlert} = useAlert()
    let [changeImage, setChangeImage] = useState(false);
    let nav = useNavigate();
    let location = useLocation();
    let postId = location.pathname.slice(12);

    let token = Cookies.get("token");
    // user or updatePost
    let pathMatch = location.pathname.match(/^\/([^\\/]+)/);

    let mood = "";

    if (pathMatch) {
        if (pathMatch[1] === "user") {
            mood = "create";
        } else if (pathMatch[1] === "updatePost") {
            mood = "update";
        }
    }

    const [preview, setPreview] = useState("");
    let { setLoading } = useLoading();
    let {setPosts} = usePosts()
    // fill inputs for post by id
    useEffect(() => {
        async function getPostData() {
            console.log(mood);
            if (mood == "update") {
                try {
                    setLoading(true)
                    let postData = await axios.get(
                        `${import.meta.env.VITE_BASE_URL}/post/${postId}`,
                        {
                            headers: { token: token },
                            withCredentials: true
                        }
                    );
                    // console.log(postData.data);
                    setInput({
                        title: postData.data.title,
                        description: postData.data.description,
                        category: postData.data.category,
                        image: postData.data.image,
                    });
                    setPreview(postData.data.image.url);
                    setPosts(prev =>
                            prev.map(post =>
                                post._id === postId ? postData.data : post
                            )
                        );
                } catch (err) {
                    console.log(err.response.data);
                }finally{
                    setLoading(false)
                }
            }
        }
        getPostData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    // handle change image
    const handleImageChange = (e) => {
        setChangeImage(true);
        const file = e.target.files[0];
        if (file) {
            setPreview(URL.createObjectURL(file));
            setInput((prev) => ({ ...prev, image: file }));
        }
    };
    // handle create and update post
    async function handlePost(e) {
        e.preventDefault();
        setInput({ title: "", description: "", category: "", image: null });
        if (mood == "create") {
            try {
                setLoading(true)
                let formData = new FormData();
                formData.append("title", input.title);
                formData.append("description", input.description);
                formData.append("category", input.category);
                formData.append("image", input.image);
                let res = await axios.post(
                    `${import.meta.env.VITE_BASE_URL}/post`,
                    formData,
                    {
                        headers: {
                            "Content-Type": "multipart/form-data",
                            token: token,
                        },
                        withCredentials: true
                    }
                );
                console.log(res.data);
                setPosts(prev => [res.data, ...prev]);
                setAlert({
                    visible: true,
                    type: "success",
                    message: "Post Added successfully",
                });
            } catch (err) {
                console.log(err.response.data);
                setAlert({
                    visible: true,
                    type: "danger",
                    message: err.response.data,
                });
            }finally{
                setLoading(false)
            }
        } else if(mood == "update") {
            try {
                setLoading(true);
            
                // update post details
                let res = await axios.put(
                    `${import.meta.env.VITE_BASE_URL}/post/${postId}`,
                    {
                        title: input.title,
                        description: input.description,
                        category: input.category,
                    },
                    {
                        headers: { token: token },
                        withCredentials: true
                    }
                );
            
                let updatedPost = res.data; // your backend should return the updated post
            
                // if image changed, update it
                if (changeImage) {
                    let formData = new FormData();
                    formData.append("image", input.image);
            
                    let resImage = await axios.put(
                        `${import.meta.env.VITE_BASE_URL}/post/updatePhoto/${postId}`,
                        formData,
                        {
                            headers: {
                                "Content-Type": "multipart/form-data",
                                token: token,
                            },
                            withCredentials: true
                        }
                    );
            
                    updatedPost = resImage.data; // update with image response
                    setChangeImage(false);
                }
            
                // update posts in UI
                setPosts(prev =>
                    prev.map(p => (p._id === postId ? updatedPost : p))
                );
                setAlert({
                    visible: true,
                    type: "success",
                    message: "Post updated successfully",
                });
            
                nav("/posts");
            } catch (err) {
                console.log(err.response?.data || err.message);
                setAlert({
                    visible: true,
                    type: "success",
                    message: err.response?.data || err.message,
                });
            } finally {
                setLoading(false);
            }
        }
    }
    return (
        <>
            <div className="w-full flex justify-center">
                <form className="max-w-96 w-full text-center border border-gray-300/60 rounded-2xl px-8 bg-[var(--color-background)]">
                    {/* Title */}
                    <h2 className="text-[var(--color-text)] text-3xl mt-10 font-medium">
                        {mood == "create" ? "Add Post" : "Update Post"}
                    </h2>

                    {/* title input */}
                    <div className="flex items-center w-full mt-10 border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2 bg-transparent">
                        <svg
                            fill="#e5e7eb"
                            height="10px"
                            width="10px"
                            version="1.1"
                            id="Layer_1"
                            xmlns="http://www.w3.org/2000/svg"
                            xmlnsXlink="http://www.w3.org/1999/xlink"
                            viewBox="0 0 512 512"
                            enableBackground="new 0 0 512 512"
                            xmlSpace="preserve"
                        >
                            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                            <g
                                id="SVGRepo_tracerCarrier"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            ></g>
                            <g id="SVGRepo_iconCarrier">
                                <path d="M46.5,0v139.6h23.3c0-23.3,0-69.8,23.3-93.1c23.2-23.3,46.5-23.3,69.8-23.3h46.5v395.6c0,34.9-11.6,69.8-46.5,69.8l-22.8,0 l-0.5,23.2h232.7v-23.3h-23.3c-34.9,0-46.5-34.9-46.5-69.8V23.3h46.5c23.3,0,46.5,0,69.8,23.3s23.3,69.8,23.3,93.1h23.3V0H46.5z"></path>
                            </g>
                        </svg>
                        <input
                            type="text"
                            placeholder="Title"
                            required
                            onChange={(e) => {
                                setInput({ ...input, title: e.target.value });
                            }}
                            value={input.title}
                            className="bg-transparent text-text placeholder-gray-400 outline-none text-sm w-full h-full"
                        />
                    </div>
                    {/* description input */}
                    <div className="flex items-center w-full mt-10 border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2 bg-transparent">
                        <svg
                            height="10px"
                            width="10px"
                            viewBox="0 0 20 20"
                            version="1.1"
                            xmlns="http://www.w3.org/2000/svg"
                            xmlnsXlink="http://www.w3.org/1999/xlink"
                            fill="#e5e7eb"
                        >
                            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                            <g
                                id="SVGRepo_tracerCarrier"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            ></g>
                            <g id="SVGRepo_iconCarrier">
                                <title>paragraph [#670]</title>
                                <desc>Created with Sketch.</desc> <defs> </defs>
                                <g
                                    id="Page-1"
                                    stroke="none"
                                    strokeWidth="1"
                                    fill="none"
                                    fillRule="evenodd"
                                >
                                    <g
                                        id="Dribbble-Light-Preview"
                                        transform="translate(-380.000000, -5199.000000)"
                                        fill="#e5e7eb"
                                    >
                                        <g
                                            id="icons"
                                            transform="translate(56.000000, 160.000000)"
                                        >
                                            <path
                                                d="M334,5049 L330,5049 C325,5049 325,5041 330,5041 L334,5041 L334,5049 Z M330,5039 C322,5039 322,5051 330,5051 L334,5051 L334,5059 L336,5059 L336,5041 L338,5041 L338,5059 L340,5059 L340,5041 L344,5041 L344,5039 L330,5039 Z"
                                                id="paragraph-[#670]"
                                            ></path>
                                        </g>
                                    </g>
                                </g>
                            </g>
                        </svg>
                        <input
                            type="text"
                            placeholder="Description"
                            required
                            onChange={(e) => {
                                setInput({
                                    ...input,
                                    description: e.target.value,
                                });
                            }}
                            value={input.description}
                            className="bg-transparent text-text placeholder-gray-400 outline-none text-sm w-full h-full"
                        />
                    </div>
                    {/* category input */}
                    <div className="flex items-center w-full mt-10 border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2 bg-transparent">
                        <svg
                            height="10px"
                            width="10px"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                            <g
                                id="SVGRepo_tracerCarrier"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            ></g>
                            <g id="SVGRepo_iconCarrier">
                                <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M3.75 4.5L4.5 3.75H10.5L11.25 4.5V10.5L10.5 11.25H4.5L3.75 10.5V4.5ZM5.25 5.25V9.75H9.75V5.25H5.25ZM13.5 3.75L12.75 4.5V10.5L13.5 11.25H19.5L20.25 10.5V4.5L19.5 3.75H13.5ZM14.25 9.75V5.25H18.75V9.75H14.25ZM17.25 20.25H15.75V17.25H12.75V15.75H15.75V12.75H17.25V15.75H20.25V17.25H17.25V20.25ZM4.5 12.75L3.75 13.5V19.5L4.5 20.25H10.5L11.25 19.5V13.5L10.5 12.75H4.5ZM5.25 18.75V14.25H9.75V18.75H5.25Z"
                                    fill="#e5e7eb"
                                ></path>
                            </g>
                        </svg>
                        <input
                            type="text"
                            placeholder="Category"
                            required
                            onChange={(e) => {
                                setInput({
                                    ...input,
                                    category: e.target.value,
                                });
                            }}
                            value={input.category}
                            className="bg-transparent text-text placeholder-gray-400 outline-none text-sm w-full h-full"
                        />
                    </div>

                    {/* image */}
                    <div className="w-full flex justify-center ">
                        <label
                            htmlFor="fileInput"
                            className="group bg-transparent relative mt-6 flex w-full max-w-sm flex-col items-center justify-center rounded-2xl border-2 border-dashed border-primary  p-8 text-center shadow-sm transition hover:border-border hover:shadow-md cursor-pointer"
                        >
                            {/* Icon */}
                            <div className="flex h-16 w-16 items-center justify-center rounded-full group-hover:bg-primary transition">
                                <svg
                                    width="36"
                                    height="36"
                                    viewBox="0 0 44 44"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="stroke-primary group-hover:stroke-text transition"
                                >
                                    <path
                                        d="M25.665 3.667H11a3.667 3.667 0 0 0-3.667 3.666v29.334A3.667 3.667 0 0 0 11 40.333h22a3.667 3.667 0 0 0 3.666-3.666v-22m-11-11 11 11m-11-11v11h11m-7.333 9.166H14.665m14.667 7.334H14.665M18.332 16.5h-3.667"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </div>

                            {/* Text */}
                            <p className="mt-4 text-sm font-medium text-gray-700">
                                Drag & drop your files here
                            </p>
                            <p className="text-xs text-gray-500">
                                or
                                <span className="text-primary underline">
                                    click
                                </span>
                                to upload
                            </p>

                            {/* Input (hidden) */}
                            <input
                                id="fileInput"
                                type="file"
                                className="hidden"
                                onChange={(e) => handleImageChange(e)}
                            />

                            {/* Preview */}
                            {input.image && (
                                <div className="mt-5 flex flex-col items-center gap-2">
                                    <img
                                        src={preview}
                                        alt="preview"
                                        className="h-20 w-20 rounded-full object-cover shadow-md ring-2 ring-primary"
                                    />
                                    <p className="text-xs text-gray-500 truncate max-w-[150px]">
                                        {mood == "create"
                                            ? input.image.name
                                            : input.image.publicId}
                                    </p>
                                </div>
                            )}
                        </label>
                    </div>

                    {/* Submit button */}
                    <button
                        type="submit"
                        onClick={(e) => handlePost(e)}
                        className="cursor-pointer my-9 w-full h-11 rounded-full text-white bg-primary hover:opacity-90 transition-opacity"
                    >
                        {mood == "create" ? "Add Post" : "Update Post"}
                    </button>
                </form>
            </div>
        </>
    );
}
