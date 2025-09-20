import { Route, Routes } from "react-router-dom";
import Hero from "./pages/Hero";
import Nav from "./components/Nav";
import Posts from "./pages/Posts";
import NotFound from "./pages/NotFound";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/Auth";
import HandlePost from "./components/HandlePost";
import Dialog from "./components/Dialog";
import { useLoading } from "./context/Loading";
import BookMark from "./pages/BookMark";
import Comment from "./pages/Comment";
import AdminPanel from "./pages/AdminPanel";
import { AlertProvider } from "./context/Alert";
import Alert from "./components/Alert";

function App() {
    let { loading } = useLoading();
    return (
        <>
            {/* container */}
            <div className="dark bg-background min-h-screen items-start text-text w-full flex flex-col px-20">
                <AlertProvider>
                    <AuthProvider>
                        <Nav />
                        <div className="w-full min-h-[calc(100vh-130px)]">
                            <Routes>
                                <Route path="/" element={<Hero />} />
                                <Route path="/home" element={<Hero />} />
                                <Route path="/posts" element={<Posts />} />
                                <Route
                                    path="/user/:id"
                                    element={
                                        <ProtectedRoute>
                                            <Profile />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/updatePost/:id"
                                    element={
                                        <ProtectedRoute>
                                            <HandlePost />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/comment/:id"
                                    element={
                                        <ProtectedRoute>
                                            <Comment />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/myBookMark"
                                    element={<BookMark />}
                                />
                                <Route
                                    path="/AdminPanel"
                                    element={<AdminPanel />}
                                />
                                <Route
                                    path="/register"
                                    element={<Register />}
                                />
                                <Route path="/login" element={<Login />} />
                                <Route path="*" element={<NotFound />} />
                            </Routes>
                            {loading && (
                                <div className="fixed inset-0 flex items-center justify-center bg-background/60 z-50">
                                    <span className="loader" />
                                </div>
                            )}
                        </div>
                        <Alert />
                    </AuthProvider>
                <Dialog />
                </AlertProvider>
            </div>
        </>
    );
}

export default App;
