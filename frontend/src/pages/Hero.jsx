import { useNavigate } from "react-router-dom";
import TextType from "../components/TextType";
import { useAuth } from "../context/Auth";

export default function Hero() {
    let nav = useNavigate()
    let {user} = useAuth
    function getStart(){
        if (user){
            nav("/profile")
        }else{
            nav("/login")
        }
    }
    return (
        <>
            {/* hero container */}
            <div className="absolute right-0 h-[calc(100vh-130px)] overflow-hidden font-family-base text-text text-5xl flex flex-col justify-center items-center w-full lg:text-8xl">
                <h2 className="leading-16 flex text-5xl flex-col items-center justify-center md:flex-row md:gap-3">
                    <span>A Space For</span>
                    <span className="relative text-primary font-bold">
                        <TextType
                            text={["IDEAS", "STORIES", "LEARNING"]}
                            typingSpeed={120}
                            pauseDuration={2000}
                            showCursor={true}
                            cursorCharacter="|"
                        />
                        <span className="lg:w-28 lg:h-28 w-[50px] h-[50px] rounded-full blur-3xl bg-primary absolute top-0 right-[40px]" />
                    </span>
                </h2>
                <button onClick={()=>getStart()} className="btn btn-accent mt-8 text-4xl transition-all duration-400 tracking-wide hover:tracking-widest">
                    Get Start
                </button>
                <span className="bg-[url(/Group.png)] w-[261px] h-[94px] absolute bg-no-repeat right-0 top-5" />
                <span className="bg-[url(/Group.png)] w-[261px] h-[94px] absolute bg-no-repeat left-0 bottom-5" />
            </div>
        </>
    );
}
