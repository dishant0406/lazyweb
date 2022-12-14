import { formatUrl } from "lib/formatUrl"
import { useWebsiteMetaData,useWebsiteScreenshot } from "hooks"
import { useEffect, useState } from 'react';

type Props = {
  url:string,
  title:string,
  description:string,
  image:string
}

const ResourceCard = ({url, title, description, image}: Props) => {
  const formattedUrl = formatUrl(url)

  const handleGoto = ():void=>{
    window.open(formattedUrl, '_blank');

  }

  return (
    <div className={`w-[18rem] relative transition h-[16rem] bg-altGray rounded-[20px]`}>
      <img src={image} className="w-[18rem] h-[10rem] rounded-t-[20px]"/>
      <div className="w-[18rem] h-[6rem] flex flex-col ml-[1rem] justify-center">
        <div className="text-white text-[16px] font-[500]">{title.slice(0,28)}{title.length>28&&'...'}</div>
        <div className="text-[#6c6c6c] w-[90%] text-[14px]">{description.slice(0,55)}{description.length>55&&'.....'}</div>
      </div>
      <button onClick={handleGoto} className="text-white hover:scale-[1.05] transition-all absolute bottom-[10px] right-[10px] px-[10px] py-[2px] text-[12px] bg-[#1c64ec] rounded-[20px]">Link</button>
    </div>
  )
}

export default ResourceCard