import { formatUrl } from "../../../lib/formatUrl"
import { useWebsiteMetaData,useWebsiteScreenshot } from "../../../hooks"
import { useEffect, useState } from 'react';

type Props = {
  url:string
}

const ResourceCard = ({url}: Props) => {
  const formattedUrl = formatUrl(url)
  const [imgData, setImageData] = useState('')
  const [websiteData, setWebsiteData] = useState({
    title:'',
    description:'',
    image:'',
  })

  useEffect(()=>{
    (
      async ()=>{
        const imgData = await useWebsiteScreenshot(formattedUrl)
        setImageData(imgData)
        const metaData = await useWebsiteMetaData(formattedUrl)
        const webData = {
          title:metaData.title || 'Not Available',
          description:metaData.description || 'Not Available',
          image:metaData.banner || 'Not Available'
        }
        setWebsiteData(webData)
      }
    )()
  },[])

  return (
    <div className={`w-[18rem] relative ${imgData===''&&websiteData.title===''?'scale-[0]':'scale-[1]'} transition h-[16rem] bg-altGray rounded-[20px]`}>
      <img src={imgData} className="w-[18rem] h-[10rem] rounded-t-[20px]"/>
      <div className="w-[18rem] h-[6rem] flex flex-col ml-[1rem] justify-center">
        <div className="text-white text-[16px] font-[500]">{websiteData.title.slice(0,28)}{websiteData.title.length>28&&'...'}</div>
        <div className="text-[#6c6c6c] w-[90%] text-[14px]">{websiteData.description.slice(0,55)}{websiteData.description.length>55&&'.....'}</div>
      </div>
      <button className="text-white absolute bottom-[10px] right-[10px] px-[10px] py-[2px] text-[12px] bg-[#1c64ec] rounded-[20px]">Link</button>
    </div>
  )
}

export default ResourceCard