import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function ProtectedRoute({ children }) {
  let token = Cookies.get("token");
  let nav = useNavigate();

  useEffect(() => {
    if (!token) {
      nav("/login");
    }
  }, [token, nav]);
  
  if (!token) return null;

  return children;
}
