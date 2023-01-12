import { Resource } from '@/hooks/Zustand'
import React from 'react'
import { LazyLoadImage } from 'react-lazy-load-image-component'

type Props = {
  resource: Resource
}

const cardData = {
  id: 18,
  created_at: "2022-12-15T07:07:45.44912+00:00",
  created_by: "48a42f91-87ad-41bd-973b-357bb6adbfe4",
  url: "colorsandfonts.com",
  tags: [
    "all time favourite",
    "design improvement"
  ],
  image_url: "https://api.lazyweb.rocks/http://colorsandfonts.com.png",
  title: "Colors & Fonts Colors & Fonts Colors & Fonts Colors & Fonts Colors & Fonts Colors & Fonts",
  desc: "Color and typography for Web Developers and Digital Designers.",
  isPublicAvailable: true,
  likes: 1,
  isAvailableForApproval: false,
  category: "ui/ux",
  created_by_list: [
    "48a42f91-87ad-41bd-973b-357bb6adbfe4"
  ]
}



const MobileResourceCard = ({resource}: Props) => {
  return (
    <div className='w-[11rem] rounded-xl overflow-hidden bg-altGray'>
      {/* <img src={resource.image_url}/> */}
      <div className='mb-[1.5rem]'>
      <LazyLoadImage
        alt={resource.title}
        height={100}
        className='rounded-t-[20px]'
        effect="blur"
        delayTime={1000}
        placeholderSrc="assets/placeholder-website.png"
        src={resource.image_url} // use normal <img> attributes as props
        width={200} />
      </div>
      <div className='w-[11rem] flex justify-center my-[10px]'>
        <div className='w-[95%]'>
          <h1 className='text-white font-[600]'>{resource.title.slice(0,14)}...</h1>
          <p className='text-white text-[14px] opacity-80'>{resource.desc.slice(0,45)}...</p>
        </div>
      </div>
    </div>
  )
}

export default MobileResourceCard