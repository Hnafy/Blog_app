import Post from "../components/Post"
import { usePosts } from "../context/Post"

export default function BookMark(){
  let {posts,setPosts} = usePosts()
  return(
    <>
    <div className="w-full flex mt-10 flex-col gap-7 items-center">
      <h2 className=" text-2xl text-center font-bold">Book Mark</h2>
      {posts.map((post)=><Post key={post._id} post={post} onRemoveBookmark={(id) => setPosts(prev => prev.filter(p => p._id !== id))}/>)}
    </div>
    </>
  )
}