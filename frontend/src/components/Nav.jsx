import "@fortawesome/fontawesome-free/css/all.min.css";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { useAuth } from "../context/Auth";

export default function Nav() {
    let [menu, setMenu] = useState(false);
    let location = useLocation();
    let [activePage, setActivePage] = useState(location.pathname);
    let { user, logout } = useAuth();
    let token = Cookies.get("token");
    let nav = useNavigate();
    // console.log(user)
    return (
        <>
            {/* nav container */}
            <div className="flex w-full min-h-[130px] justify-between items-center py-10 bg-transparent relative">
                {/* logo */}
                <div
                    className="text-2xl active cursor-pointer"
                    onClick={() => setActivePage("/home")}
                >
                    <Link to="home">Hanafy</Link>
                </div>

                {/* line image */}
                <div className="bg-[url(/Line-8.png)] w-full h-[25px] absolute bottom-[15px] bg-no-repeat bg-contain"></div>

                {token ? (
                    <>
                        {/* lg */}
                        <div className="flex items-center text-xs gap-1 md:text-xl md:gap-5">
                            <Link
                                to="posts"
                                onClick={() => setActivePage("/posts")}
                                className={
                                    activePage === "/posts"
                                        ? "active hidden md:block"
                                        : "hidden md:block"
                                }
                            >
                                posts
                            </Link>
                            <Link
                                to={`myBookMark`}
                                onClick={() => {
                                    setActivePage("/myBookMark");
                                    setMenu((e) => !e);
                                }}
                                className={
                                    activePage == "/myBookMark"
                                        ? "active hidden md:block"
                                        : "hidden md:block"
                                }
                            >
                                My BookMark
                            </Link>
                            {user.isAdmin && (
                            <Link
                                to={`AdminPanel`}
                                onClick={() => {
                                    setActivePage("/AdminPanel");
                                    setMenu((e) => !e);
                                }}
                                className={
                                    activePage == "/AdminPanel"
                                        ? "active hidden md:block"
                                        : "hidden md:block"
                                }
                            >
                                AdminPanel
                            </Link>
                            )}
                            <div
                                onClick={() => {
                                    if (window.innerWidth >= 768) {
                                        // lg ↑
                                        setActivePage("/profile");
                                        nav(`/user/${user.id}`);
                                    } else {
                                        // sm ↓
                                        setMenu((e) => !e);
                                    }
                                }}
                                className="flex items-center gap-2.5 cursor-pointer"
                            >
                                <p>{user.user}</p>
                                <img
                                    className="w-[25px] h-[25px] text-xs rounded-full border-2 border-primary p-.5"
                                    src={user.profilePhoto.avatar}
                                    alt={user.user}
                                />
                            </div>

                            <button
                                onClick={() => {
                                    logout();
                                    nav("/home");
                                }}
                                className="btn btn-error"
                            >
                                Logout
                            </button>
                        </div>

                        {/* sm */}
                        <div
                            className={`md:hidden absolute z-10 bottom-[-120px] w-full p-2.5 bg-surface text-base flex flex-col 
                    transition-all duration-500 ease-in-out
                    ${
                        menu
                            ? "opacity-100 translate-y-0"
                            : "opacity-0 -translate-y-5 pointer-events-none"
                    }`}
                        >
                            <Link
                                to="home"
                                onClick={() => {
                                    setActivePage("/home");
                                    setMenu((e) => !e);
                                }}
                                className={
                                    activePage === "/home"
                                        ? "active pb-2.5 border-b-2 border-text"
                                        : "pb-2.5 border-b-2 border-text"
                                }
                            >
                                Home
                            </Link>
                            <Link
                                to={`/user/${user.id}`}
                                onClick={() => {
                                    setActivePage("/profile");
                                    setMenu((e) => !e);
                                }}
                                className={
                                    activePage === "/profile"
                                        ? "active pb-2.5 border-b-2 border-text"
                                        : "pb-2.5 border-b-2 border-text"
                                }
                            >
                                Profile
                            </Link>
                            <Link
                                to="posts"
                                onClick={() => {
                                    setActivePage("/posts");
                                    setMenu((e) => !e);
                                }}
                                className={
                                    activePage === "/posts"
                                        ? "active pb-2.5 border-b-2 border-text"
                                        : "pb-2.5 border-b-2 border-text"
                                }
                            >
                                posts
                            </Link>
                            <Link
                                to={`myBookMark/${user.id}`}
                                onClick={() => {
                                    setActivePage("/bookmark");
                                    setMenu((e) => !e);
                                }}
                                className={
                                    activePage === "/bookmark"
                                        ? "active pb-2.5 border-b-2 border-text"
                                        : "pb-2.5 border-b-2 border-text"
                                }
                            >
                                My BookMark
                            </Link>
                            {user.isAdmin && (
                            <Link
                                to={`AdminPanel`}
                                onClick={() => {
                                    setActivePage("/AdminPanel");
                                    setMenu((e) => !e);
                                }}
                                className={
                                    activePage === "/AdminPanel"
                                        ? "active pb-2.5"
                                        : "pb-2.5"
                                }
                            >
                                AdminPanel
                            </Link>
                            )}
                        </div>
                    </>
                ) : (
                    <>
                        {/* lg */}
                        <div className="hidden md:flex gap-10 justify-center items-center text-xl">
                            <Link
                                to="home"
                                onClick={() => setActivePage("/home")}
                                className={
                                    activePage === "/home" ? "active" : ""
                                }
                            >
                                Home
                            </Link>
                            <Link
                                to="posts"
                                onClick={() => setActivePage("/posts")}
                                className={
                                    activePage === "/posts" ? "active" : ""
                                }
                            >
                                posts
                            </Link>
                            <Link
                                to="login"
                                onClick={() => setActivePage("/login")}
                                className="btn btn-secondary"
                            >
                                Login
                            </Link>
                            <Link
                                to="register"
                                onClick={() => setActivePage("/register")}
                                className="btn btn-primary"
                            >
                                Register
                            </Link>
                        </div>
                        {/* menu */}
                        <div
                            className="md:hidden"
                            onClick={() => setMenu((e) => !e)}
                        >
                            <i className="fa-solid fa-bars cursor-pointer" />
                        </div>

                        {/* sm */}
                        <div
                            className={`md:hidden absolute z-10 bottom-[-120px] w-full p-2.5 bg-surface text-base flex flex-col 
                    transition-all duration-500 ease-in-out
                    ${
                        menu
                            ? "opacity-100 translate-y-0"
                            : "opacity-0 -translate-y-5 pointer-events-none"
                    }`}
                        >
                            <Link
                                to="home"
                                onClick={() => {
                                    setActivePage("/home");
                                    setMenu((e) => !e);
                                }}
                                className={
                                    activePage === "/home"
                                        ? "active pb-2.5 border-b-2 border-text"
                                        : "pb-2.5 border-b-2 border-text"
                                }
                            >
                                Home
                            </Link>
                            <Link
                                to="posts"
                                onClick={() => {
                                    setActivePage("/posts");
                                    setMenu((e) => !e);
                                }}
                                className={
                                    activePage === "/posts"
                                        ? "active pb-2.5 border-b-2 border-text"
                                        : "pb-2.5 border-b-2 border-text"
                                }
                            >
                                posts
                            </Link>
                            <Link
                                to="login"
                                onClick={() => {
                                    setActivePage("/login");
                                    setMenu((e) => !e);
                                }}
                                className={
                                    activePage === "/login"
                                        ? "active pb-2.5 border-b-2 border-text"
                                        : "pb-2.5 border-b-2 border-text"
                                }
                            >
                                Login
                            </Link>
                            <Link
                                to="register"
                                onClick={() => {
                                    setActivePage("/register");
                                    setMenu((e) => !e);
                                }}
                                className={
                                    activePage === "/register"
                                        ? "active pb-2.5"
                                        : "pb-2.5"
                                }
                            >
                                register
                            </Link>
                        </div>
                    </>
                )}
            </div>
        </>
    );
}
