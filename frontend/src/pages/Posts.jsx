import Post from "../components/Post";
import { usePosts } from "../context/Post";

export default function Posts() {
    let {posts,hasMore} = usePosts()

    return (
        <>
            {/* posts container */}
            <div className="w-full flex flex-col gap-7 items-center">
                {posts.map((post) => (
                    <Post
                        post={post}
                        key={post.id}
                    />
                ))}
            </div>

            {/* no more */}
            <div className="text-center my-10">
                {!hasMore && <p className="text-gray-500">No more posts</p>}
            </div>

        </>
    );
}
