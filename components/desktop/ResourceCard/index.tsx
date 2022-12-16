import { formatUrl } from "lib/formatUrl"
import { Resource } from "@/hooks/Zustand"
import {HiOutlineStar,HiStar} from 'react-icons/hi'
import { useEffect, useState } from "react"
import {useCheckIfResourceBookmarked,useSetBookmark,useUserData} from 'hooks/Zustand'
import { supabaseClient } from "@/lib/supabaseClient"
import { AnimatePresence, motion } from 'framer-motion';

type Props = {
  url:string,
  title:string,
  description:string,
  image:string,
  resource:Resource
}

const ResourceCard = ({url, title, description, image, resource}: Props) => {
  const formattedUrl = formatUrl(url)
  const [isHover, setISHover] = useState(false)
  const {setBookmark,setComplete} = useSetBookmark()
  const [isBookmarked,setIsBookmarked] = useState(false)
  const {session} = useUserData()

  const handleGoto = ():void=>{
    window.open(formattedUrl, '_blank');
  }

  useEffect(()=>{
    getBookMarked()
  },[setComplete])

  const getBookMarked = async ()=>{
    //check if the user has bookmarked the resource
    if(session && resource.isPublicAvailable){
      const {data,error} = await supabaseClient.from('bookmarks').select('*').eq('resource_id', resource.id).eq('bookmarked_by', session.id)
      //check if the resource if publicly available or not
      if(data){
        if(data.length>0){
          setIsBookmarked(true)
        }else{
          setIsBookmarked(false)
        }
      }
    }
  }

  const handleBookMark = async ()=>{
    setBookmark(resource.id)
  }

  const varients = {
    booked:{rotate:360, scale:1.3},
    notBooked:{rotate:-360, scale:1}
  }

  return (
    <div className={`w-[18rem] relative transition h-[16rem] bg-altGray rounded-[20px]`}>
      <img src={image} className="w-[18rem] h-[10rem] rounded-t-[20px]"/>
      <div className="w-[18rem] h-[6rem] flex flex-col ml-[1rem] justify-center">
        <div className="text-white text-[16px] font-[500]">{title.slice(0,28)}{title.length>28&&'...'}</div>
        <div className="text-[#6c6c6c] w-[90%] text-[14px]">{description.slice(0,55)}{description.length>55&&'.....'}</div>
      </div>
      <button onClick={handleGoto} className="text-white hover:scale-[1.05] transition-all absolute bottom-[10px] right-[10px] px-[10px] py-[2px] text-[12px] bg-[#1c64ec] rounded-[20px]">Link</button>
      <motion.div animate={isBookmarked?'booked':'notBooked'} variants={varients} onClick={handleBookMark} onMouseEnter={()=>setISHover(true)} onMouseLeave={()=>setISHover(false)} className="h-[2rem] flex cursor-pointer justify-center items-center w-[2rem] absolute top-[1px] right-[10px]">
        <AnimatePresence>
          {(isHover || isBookmarked)?(
            <motion.div
              initial={{scale:0}}
              animate={{scale:1}}
              exit={{scale:0}}
              className="text-[#1c64ec]">
              <HiStar className="text-[18px] "/>
            </motion.div>
          ):(
            <motion.div
              initial={{scale:0}}
              animate={{scale:1}}
              exit={{scale:0}}
              className="text-[#6c6c6c]">
              <HiOutlineStar className="text-[18px] "/>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}

export default ResourceCard