import { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { useAlert } from "./Alert.jsx";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    // load from localStorage if available
    const storedUser = localStorage.getItem("user");
    return storedUser
      ? JSON.parse(storedUser)
      : {
          user: "",
          email: "",
          posts: [],
          profilePhoto: { avatar: null },
        };
  });

  let { setAlert } = useAlert();

  // sync user state to localStorage
  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(user));
  }, [user]);

  // check token on first load
  useEffect(() => {
    const initAuth = async () => {
      const token = Cookies.get("token");
      if (!token) return;

      try {
        // verify token to get userId
        const verifyRes = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/user/verify`,
          { headers: { token },withCredentials: true }
        );
        const userId = verifyRes.data.decoded.id;

        // fetch full user profile
        const userRes = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/user/${userId}`,
          { headers: { token },withCredentials: true }
        );

        setUser(userRes.data); // will also save to localStorage
      } catch (err) {
        Cookies.remove("token");
        localStorage.removeItem("user");
        console.error(err);
        setUser({
          user: "",
          email: "",
          posts: [],
          profilePhoto: { avatar: null },
        });
      }
    };

    initAuth();
  }, []);

  const login = async (token, userId) => {
    Cookies.set("token", token);

    const res = await axios.get(
      `${import.meta.env.VITE_BASE_URL}/user/${userId}`,
      { headers: { token },withCredentials: true }
    );
    setUser(res.data); // triggers localStorage update
    setAlert({
      visible: true,
      type: "success",
      message: "user login successfully",
    });
  };

  const logout = () => {
    Cookies.remove("token");
    localStorage.removeItem("user");
    setUser({
      user: "",
      email: "",
      posts: [],
      profilePhoto: { avatar: null },
    });
    setAlert({
      visible: true,
      type: "danger",
      message: "user logout",
    });
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  return useContext(AuthContext);
}
