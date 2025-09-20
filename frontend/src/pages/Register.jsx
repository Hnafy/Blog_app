import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/Auth";
import { useAlert } from "../context/Alert";

export default function Register() {
    let [input, setInput] = useState({
        name: "",
        email: "",
        password: "",
        resetPassword: "",
        avatar: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    let nav = useNavigate();
    let { login } = useAuth();
    const baseUrl = import.meta.env.VITE_BASE_URL;
    // console.log(baseUrl);
    let [accept, setAccept] = useState(false);
    let {setAlert} = useAlert()
    async function handleSubmit(e) {
        e.preventDefault();
        setAccept(true);
        // validation
        if (
            !input.name ||
            !input.email ||
            input.password.length < 8 ||
            input.password !== input.resetPassword ||
            !input.avatar
        ) {
            console.log("invalid inputs");
            setAlert({
                    visible: true,
                    type: "danger",
                    message: "invalid inputs",
                });
        } else {
            try {
                // upload user details
                let res = await axios.post(`${baseUrl}/user/register`, {
                    user: input.name,
                    email: input.email,
                    password: input.password,
                });
                console.log("✅ Registered:", res.data); // add alert

                // upload avatar
                const formData = new FormData();
                formData.append("image", input.avatar);
                let resAvatar = await axios.post(
                    `${baseUrl}/user/uploadAvatar`,
                    formData,
                    {
                        headers: {
                            "Content-Type": "multipart/form-data",
                            token: res.data.token,
                        },
                    }
                );
                console.log("✅ Registered:", resAvatar.data);

                // save token in cookie
                login(res.data.token, res.data.id);
                // navigate to user page
                nav(`/user/${res.data.id}`);

                setAccept(false);
            } catch (err) {
                console.log(err.response.data);
                setAlert({
                    visible: true,
                    type: "danger",
                    message: err.response.data,
                });
            }
        }
    }

    return (
        <>
            <div className="w-full min-h-[calc(100vh-130px)] flex justify-center items-center">
                <form className="max-w-96 w-full text-center border border-gray-300/60 rounded-2xl px-8 bg-[var(--color-background)]">
                    {/* Title */}
                    <h1 className="text-[var(--color-text)] text-3xl mt-10 font-medium">
                        Register
                    </h1>
                    <p className="text-gray-500 text-sm mt-2">
                        Please sign Up to continue
                    </p>

                    {/* User input */}
                    <div className="flex items-center w-full mt-10 border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2 bg-transparent">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 16 16"
                            fill="currentColor"
                            className="h-4 w-4 opacity-70"
                        >
                            <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
                        </svg>
                        <input
                            type="text"
                            placeholder="User Name"
                            required
                            onChange={(e) => {
                                setInput({ ...input, name: e.target.value });
                            }}
                            value={input.name}
                            className="bg-transparent text-text placeholder-gray-400 outline-none text-sm w-full h-full"
                        />
                    </div>
                    {input.name.length < 1 && accept ? (
                        <p className="text-error text-start">
                            User Name Is Required
                        </p>
                    ) : (
                        ""
                    )}
                    {/* Email input */}
                    <div className="flex items-center w-full mt-4 border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2 bg-transparent">
                        <svg
                            width="16"
                            height="11"
                            viewBox="0 0 16 11"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M0 .55.571 0H15.43l.57.55v9.9l-.571.55H.57L0 10.45zm1.143 1.138V9.9h13.714V1.69l-6.503 4.8h-.697zM13.749 1.1H2.25L8 5.356z"
                                fill="#6B7280"
                            ></path>
                        </svg>
                        <input
                            type="email"
                            placeholder="Email"
                            required
                            onChange={(e) => {
                                setInput({ ...input, email: e.target.value });
                            }}
                            value={input.email}
                            className="bg-transparent text-text placeholder-gray-400 outline-none text-sm w-full h-full"
                        />
                    </div>
                    {input.email.length < 1 && accept ? (
                        <p className="text-error text-start">
                            Email Is Required
                        </p>
                    ) : (
                        ""
                    )}

                    {/* Password input */}
                    <div className="flex items-center mt-4 w-full border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 pr-3 gap-2 bg-transparent">
                        <svg
                            width="13"
                            height="17"
                            viewBox="0 0 13 17"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M13 8.5c0-.938-.729-1.7-1.625-1.7h-.812V4.25C10.563 1.907 8.74 0 6.5 0S2.438 1.907 2.438 4.25V6.8h-.813C.729 6.8 0 7.562 0 8.5v6.8c0 .938.729 1.7 1.625 1.7h9.75c.896 0 1.625-.762 1.625-1.7zM4.063 4.25c0-1.406 1.093-2.55 2.437-2.55s2.438 1.144 2.438 2.55V6.8H4.061z"
                                fill="#6B7280"
                            ></path>
                        </svg>
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            required
                            onChange={(e) =>
                                setInput({
                                    ...input,
                                    password: e.target.value,
                                })
                            }
                            value={input.password}
                            className="bg-transparent text-text placeholder-gray-400 outline-none text-sm w-full h-full"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            {showPassword ? (
                                <i className="fas fa-eye-slash cursor-pointer"></i>
                            ) : (
                                <i className="fas fa-eye cursor-pointer"></i>
                            )}
                        </button>
                    </div>
                    {input.password.length < 8 && accept && (
                        <p className="text-error text-start">
                            Password must be at least 8 characters
                        </p>
                    )}

                    {/* Confirm Password input */}
                    <div className="flex items-center mt-4 w-full border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 pr-3 gap-2 bg-transparent">
                        <svg
                            width="13"
                            height="17"
                            viewBox="0 0 13 17"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M13 8.5c0-.938-.729-1.7-1.625-1.7h-.812V4.25C10.563 1.907 8.74 0 6.5 0S2.438 1.907 2.438 4.25V6.8h-.813C.729 6.8 0 7.562 0 8.5v6.8c0 .938.729 1.7 1.625 1.7h9.75c.896 0 1.625-.762 1.625-1.7zM4.063 4.25c0-1.406 1.093-2.55 2.437-2.55s2.438 1.144 2.438 2.55V6.8H4.061z"
                                fill="#6B7280"
                            ></path>
                        </svg>
                        <input
                            type={showConfirm ? "text" : "password"}
                            placeholder="Confirm Password"
                            required
                            onChange={(e) =>
                                setInput({
                                    ...input,
                                    resetPassword: e.target.value,
                                })
                            }
                            value={input.resetPassword}
                            className="bg-transparent text-text placeholder-gray-400 outline-none text-sm w-full h-full"
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirm(!showConfirm)}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            {showConfirm ? (
                                <i className="fas fa-eye-slash cursor-pointer"></i>
                            ) : (
                                <i className="fas fa-eye cursor-pointer"></i>
                            )}
                        </button>
                    </div>
                    {input.password !== input.resetPassword && accept && (
                        <p className="text-error text-start">
                            Passwords must match
                        </p>
                    )}

                    {/* avatar */}
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
                                or{" "}
                                <span className="text-primary underline">
                                    click
                                </span>{" "}
                                to upload
                            </p>

                            {/* Input (hidden) */}
                            <input
                                id="fileInput"
                                type="file"
                                className="hidden"
                                onChange={(e) =>
                                    setInput({
                                        ...input,
                                        avatar: e.target.files[0],
                                    })
                                }
                            />

                            {/* Preview */}
                            {input.avatar && (
                                <div className="mt-5 flex flex-col items-center gap-2">
                                    <img
                                        src={URL.createObjectURL(input.avatar)}
                                        alt="preview"
                                        className="h-20 w-20 rounded-full object-cover shadow-md ring-2 ring-primary"
                                    />
                                    <p className="text-xs text-gray-500 truncate max-w-[150px]">
                                        {input.avatar.name}
                                    </p>
                                </div>
                            )}
                        </label>
                    </div>

                    {/* Submit button */}
                    <button
                        type="submit"
                        onClick={(e) => handleSubmit(e)}
                        className="cursor-pointer mt-9 w-full h-11 rounded-full text-white bg-primary hover:opacity-90 transition-opacity"
                    >
                        Register
                    </button>

                    {/* Signup link */}
                    <p className="text-gray-500 text-sm mt-3 mb-11">
                        you have an account?
                        <Link className="text-primary" to="/login">
                            Login
                        </Link>
                    </p>
                </form>
            </div>
        </>
    );
}
