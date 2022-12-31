import { formatUrl } from "lib/formatUrl"
import { Resource, useAllCategory, useAllTags, useSetLikes } from "@/hooks/Zustand"
import {HiOutlineStar,HiStar} from 'react-icons/hi'
import { useEffect, useState } from "react"
import {useSetBookmark,useUserData,useSelectedTab,useAllResources,useCompleteResourceLength} from 'hooks/Zustand'
import { supabaseClient } from "@/lib/supabaseClient"
import { AnimatePresence, motion } from 'framer-motion';
import {PublishModal} from "components"
import { LazyLoadImage, ScrollPosition } from 'react-lazy-load-image-component';
import { FcLike, FcLikePlaceholder } from "react-icons/fc"
import 'react-lazy-load-image-component/src/effects/blur.css';


type Props = {
  url:string,
  title:string,
  description:string,
  image:string,
  resource:Resource,
  scrollPosition:ScrollPosition
}

const ResourceCard = ({url, title, description, image, resource, scrollPosition}: Props) => {
  const formattedUrl = formatUrl(url)
  const [isHover, setISHover] = useState(false)
  const {setBookmark,setComplete} = useSetBookmark()
  const {setComplete:setLikesComplete,setLikes} = useSetLikes()
  const [isBookmarked,setIsBookmarked] = useState(false)
  const [isLiked,setIsLiked] = useState(false)
  const {setAllResources,loading} = useAllResources()
  const {completeResourceLength} = useCompleteResourceLength()
  const {setAllCategories} = useAllCategory()
  const {setAllTags} = useAllTags()
  const {session} = useUserData()
  const {selectedTab} = useSelectedTab()
  const [isHovered, setIsHovered] = useState(false)
  const [isLikeHovered, setIsLikeHovered] = useState(false)
  const [open, setOpen] = useState(false)

  const handleGoto = ():void=>{
    window.open(formattedUrl, '_blank');
  }

  useEffect(()=>{
    getBookMarked()
  },[setComplete])

  useEffect(()=>{
    getLikes()
  }
  ,[setLikesComplete])

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

  const getLikes = async () =>{
    if(session && resource.isPublicAvailable){
      const {data,error} = await supabaseClient.from('likes').select('*').eq('resource_id', resource.id).eq('liked_by', session.id)
      if(data){
        if(data.length>0){
          setIsLiked(true)
        }else{
          setIsLiked(false)
        }
      }
    }
  }

  const handleBookMark = async ()=>{
    setBookmark(resource.id)
  }

  const handleLike = async ()=>{
    setLikes(resource.id)
  }

  const handleApproveOrReject = async (btnType:string)=>{
    if(btnType==='approve'){
      //set resource.isPublicAvailable to true in supabase
      await supabaseClient.from('website').update({isPublicAvailable:true,isAvailableForApproval:false}).eq('id',resource.id)
      //fetch resources again
      setAllResources('publish')
      setAllCategories()
      setAllTags()
    }else{
      //update isAvailableForApproval to false
      await supabaseClient.from('website').update({isAvailableForApproval:false}).eq('id',resource.id)
      //fetch resources again
      setAllResources('publish')
      setAllCategories()
      setAllTags()
    }
  }

  const varients = {
    booked:{rotate:360, scale:1.3},
    notBooked:{rotate:-360, scale:1}
  }

  //string capitalize function
  const capitalize = (s:string) => {
    if (typeof s !== 'string') return ''
    return s.charAt(0).toUpperCase() + s.slice(1).toLocaleLowerCase()
  }

  //calculate the top value of absolute box according to the number of tags available such that the space between the card and the box is 1 rem
  const calculateTopValue = (tags:string[])=>{
    if(tags.length<=3){
      return '-12rem'
    }else if(tags.length>3 && tags.length<=6){
      return '-14rem'
    }else if(tags.length>6 && tags.length<=9){
      return '-15rem'
    }else if(tags.length>9 && tags.length<=12){
      return '-16rem'
    }else if(tags.length>12 && tags.length<=15){
      return '-17rem'
    }
  }


  return (
    <div className={`w-[18rem] relative transition h-[16rem] bg-altGray rounded-[20px]`}>
      <div className="relative">
        {selectedTab==='publish' && isHovered && !loading && (
        <div>
          <div style={{
            top:calculateTopValue(resource.tags),
          }} className={`absolute border border-lightGray right-[0rem] min-w-[18rem] min-h-[10rem] pb-[1rem] rounded-[20px] bg-altGray`}>
            <p className="text-white mb-[5px] mt-[1rem] ml-[1rem]">Category:</p>
            <span className="text-white rounded-2xl bg-lightGray px-[15px] py-[2px] ml-[1.5rem]">{capitalize(resource.category)}</span>
            <p className="text-white mt-[0.5rem] ml-[1rem]">Tags:</p>
            <div className="flex gap-[0.5rem] flex-wrap mt-[5px] ml-[1.5rem]">
              {resource.tags.map((tag:string)=>(
                <span className="text-gray bg-white text-[14px] px-[10px] rounded-2xl py-[2px]">{capitalize(tag)}</span>
              ))}
            </div>

          </div>
        </div>
        )}
        {resource.created_by_list.includes(session?.id!) && !resource.isPublicAvailable && !resource.isAvailableForApproval && <div onMouseEnter={()=>setIsHovered(true)} onMouseLeave={()=>setIsHovered(false)} className="w-[18rem] absolute top-[0] left-[0] transition-all flex items-center justify-center duration-500 hover:bg-gray/[0.4] h-[10rem] rounded-t-[20px]">
          <button onClick={()=>setOpen(true)} className={`text-white hover:scale-[1.05] ${isHovered?'opacity-100':'opacity-0'} transition-all  px-[15px] py-[5px] text-[16px] bg-[#1c64ec] rounded-[20px]`}>Publish</button>
        </div>}
        {session?.isAdmin && resource.isAvailableForApproval && selectedTab==='publish' && <div onMouseEnter={()=>setIsHovered(true)} onMouseLeave={()=>setIsHovered(false)} className="w-[18rem] absolute top-[0] left-[0] transition-all flex items-center justify-center gap-[5px] duration-500 hover:bg-gray/[0.4] h-[10rem] rounded-t-[20px]">
          <button onClick={()=>handleApproveOrReject('approve')} className={`text-white hover:scale-[1.05] ${isHovered?'opacity-100':'opacity-0'} transition-all  px-[15px] py-[5px] text-[16px] bg-[#1c64ec] rounded-[20px]`}>Approve</button>
          <button onClick={()=>handleApproveOrReject('reject')} className={`text-white hover:scale-[1.05] ${isHovered?'opacity-100':'opacity-0'} transition-all  px-[15px] py-[5px] text-[16px] bg-red-600 rounded-[20px]`}>Reject</button>
        </div>}
        {/* <img src={image} className="w-[18rem] h-[10rem] rounded-t-[20px]"/> */}
        <LazyLoadImage
        alt={title}
        height={160}
        className='rounded-t-[20px]'
        effect="blur"
        delayTime={1000}
        placeholderSrc="assets/placeholder-website.png"
        src={image} // use normal <img> attributes as props
        width={288} />
      </div>
      <div className="w-[18rem] h-[6rem] flex flex-col ml-[1rem] justify-center">
        <div className="text-white text-[16px] font-[500]">{title.slice(0,28)}{title.length>28&&'...'}</div>
        <div className="text-[#6c6c6c] w-[90%] text-[14px]">{description.slice(0,55)}{description.length>55&&'.....'}</div>
      </div>
      <button onClick={handleGoto} className="text-white hover:scale-[1.05] transition-all absolute bottom-[10px] right-[10px] px-[10px] py-[2px] text-[12px] bg-[#1c64ec] rounded-[20px]">Link</button>
       {session && !resource.created_by_list.includes(session?.id!) && <motion.div animate={isBookmarked?'booked':'notBooked'} variants={varients} onClick={handleBookMark} onMouseEnter={()=>setISHover(true)} onMouseLeave={()=>setISHover(false)} className="h-[2rem] flex cursor-pointer justify-center items-center w-[2rem] absolute top-[1px] right-[10px]">
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
      </motion.div>}
       {session && resource.isPublicAvailable && <motion.div animate={isLiked?'booked':'notBooked'} variants={varients} onClick={handleLike} onMouseEnter={()=>setIsLikeHovered(true)} onMouseLeave={()=>setIsLikeHovered(false)} className="h-[2rem] flex cursor-pointer justify-center items-center w-[2rem] absolute top-[1px] left-[10px]">
        <AnimatePresence>
          {(isLikeHovered || isLiked)?(
            <motion.div
              initial={{scale:0}}
              animate={{scale:1}}
              exit={{scale:0}}
              className="text-[#1c64ec]">
              <FcLike className="text-[18px]"/>
            </motion.div>
          ):(
            <motion.div
              initial={{scale:0}}
              animate={{scale:1}}
              exit={{scale:0}}
              className="text-[#6c6c6c]">
              <FcLikePlaceholder className="text-[18px] "/>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>}
      <PublishModal id={resource.id} url={url} title={title} isOpen={open} setIsOpen={setOpen} />
    </div>
  )
}

export default ResourceCard