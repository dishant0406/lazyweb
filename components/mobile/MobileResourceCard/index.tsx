import { Resource } from '@/hooks/Zustand'
import React, { useState } from 'react'
import {BiLinkExternal} from 'react-icons/bi'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import { formatUrl } from '@/lib/formatUrl'
import { InfoModal } from 'components';
import {AiFillInfoCircle} from 'react-icons/ai'

type Props = {
  resource: Resource
}


const MobileResourceCard = ({resource}: Props) => {
  const [open, setOpen] = useState(false)
  const handleGoto = ():void=>{
    window.open(formatUrl(resource.url), '_blank');
  }
  return (
    <div className='w-[11rem] relative h-[13rem] overflow-y-hidden rounded-xl overflow-hidden bg-altGray'>
      {/* <img src={resource.image_url}/> */}
      <div className='mb-[1.5rem]'>
      <LazyLoadImage
        alt={resource.title}
        height={100}
        effect="blur"
        delayTime={1000}
        placeholderSrc="assets/placeholder-website.png"
        src={resource.image_url} // use normal <img> attributes as props
        width={200} />
        <div onClick={handleGoto} style={{backgroundColor:'rgba(32, 33, 36, 0.5)'}} className='h-[2rem] absolute top-[5px] flex items-center justify-center left-[5px] w-[2rem] rounded-full'>
          <BiLinkExternal className='text-white'/>
        </div>
        <div onClick={()=>setOpen(true)} style={{backgroundColor:'rgba(32, 33, 36, 0.5)'}} className='h-[2rem] absolute top-[5px] flex items-center justify-center right-[5px] w-[2rem] rounded-full'>
          <AiFillInfoCircle className='text-white'/>
        </div>
      </div>
      <div className='w-[11rem] flex justify-center my-[10px]'>
        <div className='w-[90%]'>
          <h1 className='text-white font-[600]'>{resource.title.slice(0,14)}...</h1>
          <p className='text-white text-[14px] opacity-80'>{resource.desc.slice(0,45)}...</p>
        </div>
      </div>
      <InfoModal isOpen={open} resource={resource} setIsOpen={setOpen}/>
    </div>
  )
}

export default MobileResourceCard