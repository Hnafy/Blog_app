import Post from "../components/Post";
import HandlePost from "../components/HandlePost";
import { usePosts } from "../context/Post";

export default function Profile() {
    let {user,posts} = usePosts()

    return (
        <>
            <div className="w-full flex mt-10 flex-col gap-7 items-center">
                <div className="flex min-w-[50%] text-xs gap-2.5 p-2 md:text-xl md:gap-10 md:p-5 justify-start items-center bg-surface rounded-sm">
                    <div>
                        <img
                            className="w-[50px] h-[50px] text-xs md:text-lg md:w-[100px] md:h-[100px] rounded-full border-2 border-primary p-1"
                            src={user.profilePhoto.avatar}
                            alt={user.name}
                        />
                    </div>
                    <div>
                        <h2>Name: {user.user}</h2>
                        <h2>Email: {user.email}</h2>
                        <h2>Posts Count: {user.posts.length}</h2>
                    </div>
                </div>
                <div>
                    <HandlePost />
                    {posts.map((post) => (
                        <Post post={post} key={post._id} />
                    ))}
                </div>
            </div>

        </>
    );
}
