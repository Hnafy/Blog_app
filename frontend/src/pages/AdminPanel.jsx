import axios from "axios";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useAlert } from "../context/Alert";

export default function AdminPanel() {
    let token = Cookies.get("token");
    let [users, setUsers] = useState([]);
    let [inputs, setInputs] = useState({
        user: "",
        email: "",
        password: "",
    });
    let [showPassword, setShowPassword] = useState(false);
    let [userId, setUserId] = useState(0);
    let [dialog, setDialog] = useState(false);
    let {setAlert} = useAlert()
    useEffect(() => {
        async function fetchData() {
            try {
                let res = await axios.get(
                    `${import.meta.env.VITE_BASE_URL}/user`,
                    {
                        headers: { token: token },
                        withCredentials: true
                    }
                );
                setUsers(res.data);
            } catch (err) {
                console.log(err);
            }
        }
        fetchData();
    }, [token]);

    
    function handleEdit(e) {
        e.preventDefault();
        async function fetchData() {
            if (!inputs.user || !inputs.email || inputs.password.length < 8) {
                console.log("invalid inputs");
                setAlert({
                    visible: true,
                    type: "danger",
                    message: "invalid inputs",
                });
                return;
            }
            try {
                let res = await axios.put(
                    `${import.meta.env.VITE_BASE_URL}/user/${userId}`,
                    {
                        user: inputs.user,
                        email: inputs.email,
                        password: inputs.password,
                    },
                    {
                        headers: { token: token },
                        withCredentials: true
                    }
                );
                setInputs({ user: "", email: "", password: "" });
                setDialog(false);
                setUsers((prev) =>
                    prev.map((u) => (u._id === userId ? res.data.updateUser : u))
                );
                setAlert({
                    visible: true,
                    type: "success",
                    message: res.data.message,
                });
            } catch (err) {
                console.log(err);
            }
        }
        fetchData();
    }
    function handleDelete(id) {
        async function fetchData() {
            try {
                let res = await axios.delete(
                    `${import.meta.env.VITE_BASE_URL}/user/${id}`,
                    {
                        headers: { token: token },
                        withCredentials: true
                    }
                );
                setUsers((prev) => prev.filter((u) => u._id !== id));
                setAlert({
                    visible: true,
                    type: "danger",
                    message: res.data.msg,
                });
            } catch (err) {
                console.log(err);
            }
        }
        fetchData();
    }
    return (
        <>
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg my-5">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">
                                Avatar
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Name
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Email
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Is Admin
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr
                                key={user._id}
                                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200"
                            >
                                <th
                                    scope="row"
                                    className="px-6 py-4 font-medium whitespace-nowrap"
                                >
                                    <img
                                        className="w-[50px] h-[50px] text-xs md:text-lg rounded-full border-2 border-primary p-1"
                                        src={
                                            user.profilePhoto.avatar ||
                                            "avatar.jpg"
                                        }
                                        alt={user.user}
                                    />
                                </th>
                                <td className="px-6 py-4">{user.user}</td>
                                <td className="px-6 py-4">{user.email}</td>
                                <td className="px-6 py-4">
                                    {user.isAdmin ? "Admin" : "member"}
                                </td>
                                <td className="px-6 py-4 flex gap-1">
                                    <button
                                        onClick={() => {
                                            setUserId(user._id);
                                            setDialog(true);
                                        }}
                                        className="btn btn-primary"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(user._id)}
                                        className="btn btn-error"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* update dialog */}

            <div
                className={`${
                    dialog
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 -translate-y-10 pointer-events-none"
                } transition-all duration-200 fixed w-full h-[100vh] top-0 left-0 flex flex-col justify-center items-center backdrop-blur-sm`}
            >
                <div className="w-[50%] border-2 border-accent rounded-lg p-5 bg-background">
                    {/* User input */}
                    <div
                        className={`flex items-center w-full border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2 bg-transparent`}
                    >
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
                                setInputs({ ...inputs, user: e.target.value });
                            }}
                            value={inputs.user}
                            className="bg-transparent text-text placeholder-gray-400 outline-none text-sm w-full h-full"
                        />
                    </div>

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
                                setInputs({ ...inputs, email: e.target.value });
                            }}
                            value={inputs.email}
                            className="bg-transparent text-text placeholder-gray-400 outline-none text-sm w-full h-full"
                        />
                    </div>

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
                                setInputs({
                                    ...inputs,
                                    password: e.target.value,
                                })
                            }
                            value={inputs.password}
                            className="bg-transparent text-text placeholder-gray-400 outline-none text-sm w-full h-full"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            {showPassword ? (
                                <i className="fas fa-eye-slash cursor-pointer" />
                            ) : (
                                <i className="fas fa-eye cursor-pointer" />
                            )}
                        </button>
                    </div>
                    <div className="flex justify-end mt-2.5">
                        <button
                            type="submit"
                            onClick={(e) => handleEdit(e)}
                            className="btn btn-primary"
                        >
                            Update
                        </button>
                        <button
                            className="btn btn-error ml-2"
                            onClick={() => setDialog(false)}
                        >
                            close
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
