import axios from "axios";
import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
} from "react";
import { useLocation } from "react-router-dom";
import { useLoading } from "./Loading";
import Cookies from "js-cookie";

let PostContext = createContext();

export function PostProvider({ children }) {
    const location = useLocation();
    let path = location.pathname;

    // Regex to capture both route ("user") and ID
    let match = path.match(/^\/([^/]+)\/([^/]+)$/);

    let userId = false;
    if (match && match[1] === "user") {
        userId = match[2];
    }

    let [posts, setPosts] = useState([]);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(1);
    let { loading, setLoading } = useLoading();

    let [user, setUser] = useState({
        user: "",
        email: "",
        posts: [],
        profilePhoto: {
            avatar: null,
        },
    });

    let token = Cookies.get("token");

    // fetch posts
    const fetchData = useCallback(async () => {
        if (loading || !hasMore) return;

        try {
            setLoading(true);
            
            let result;
            if (path.startsWith("/user")) {
                console.log("hi in profile");
                result = await axios.get(
                    `${import.meta.env.VITE_BASE_URL}/user/${userId}`,
                    {
                        headers: { token: token },
                    }
                );
                setUser(result.data);
                setPosts(result.data.posts || []);
            }
            else if (path.startsWith("/posts")) {
                console.log("hi in posts");
                result = await axios.get(
                    `${import.meta.env.VITE_BASE_URL}/post?pageNumber=${page}`
                );
                let newPosts = result.data || [];
                if (newPosts.length === 0) {
                    setHasMore(false);
                } else {
                    setPosts((prev) => [...prev, ...newPosts]);
                    setPage((prev) => prev + 1);
                }
            }
            else if (path.startsWith("/myBookMark")) {
                console.log("hi in bookmark")
                let res = await axios.get(
                    `${import.meta.env.VITE_BASE_URL}/post/userBookMark`,
                    {
                        headers: { token: token },
                    }
                );
                setPosts(res.data);
            }
            // // user profile posts
            // if (userId) {
            // } else {
            //     // global posts
            // }
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
            // setFirstLoad(false);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loading, hasMore, userId, page, token,path]);
    // Reset posts when path OR userId changes
    useEffect(() => {
        setPosts([]);
        setPage(1)
    }, [path]);

    useEffect(() => {
        fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [path]);

    // scroll listener
    useEffect(() => {
        const handleScroll = () => {
            const { scrollTop, scrollHeight, clientHeight } =
                document.documentElement;

            if (scrollTop + 130 + clientHeight >= scrollHeight) {
                if (path.startsWith("/posts")) {
                    fetchData();
                }
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [fetchData, path, userId]);

    return (
        <PostContext.Provider
            value={{ posts, setPosts, user, setUser, hasMore }}
        >
            {children}
        </PostContext.Provider>
    );
}

// eslint-disable-next-line react-refresh/only-export-components
export function usePosts() {
    return useContext(PostContext);
}
