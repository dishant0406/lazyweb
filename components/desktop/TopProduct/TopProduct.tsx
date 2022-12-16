type Props = {
  url:string,
  unformatUrl:string
}
import { useState, useEffect } from 'react';
import { useWebsiteScreenshot, useWebsiteMetaData } from 'hooks';
import { FcApproval,FcOpenedFolder,FcInfo } from "react-icons/fc";
import {BsTrophy} from 'react-icons/bs'
import {Layout, Award, Compass, ThumbsUp, Link2, Star, UserCheck, Info} from 'react-feather'

const TopProduct = ({url, unformatUrl}: Props) => {
  const [imgData, setImageData] = useState('')
  const [websiteData, setWebsiteData] = useState({
    title:'',
    description:'',
    image:'',
  })

  useEffect(()=>{
    (
      async ()=>{
        if(unformatUrl!==''){
          const imgData = await useWebsiteScreenshot(url)
          if(imgData){
            setImageData(imgData)
          }
          const metaData = await useWebsiteMetaData(url)
          const webData = {
            title:metaData.title || 'Not Available',
            description:metaData.description || 'Not Available',
            image:metaData.banner || 'Not Available'
          }
          setWebsiteData(webData)
        }
      }
    )()
  },[unformatUrl])

  return (
    <div>
      <p className="text-white mt-[1rem] ml-[1rem]">Today's Top Product</p>
      <div className="w-[100%] flex justify-center">
        <div className="flex w-[95%] gap-[1.5rem] mt-[1rem]">
          <div className={`h-[15rem] ${imgData===''?'scale-[0]':'scale-[1]'} transition-all flex items-center justify-center rounded-[20px] w-[24rem] bg-altGray`}>
            <div className="w-[22rem] flex flex-col items-center h-[12rem]">
              <div style={{backgroundImage:`url(${imgData})`, backgroundPosition:'center', backgroundSize:'cover', backgroundRepeat:'no-repeat'}} className="w-[95%] h-[6rem] rounded-[20px]"></div>
              <div className='w-[95%] flex items-center justify-between'>
                <div className='flex items-center top_product ml-[0.5rem] mt-[0.5rem] gap-[5px]'>
                  <FcOpenedFolder/>
                  <p className='text-white'>{unformatUrl}</p>
                  <FcApproval/>
                </div>
                <div className='flex items-center top_product mt-[0.5rem] gap-[5px]'>
                  <div className='h-[10px] w-[10px] rounded-full bg-[#0eaf62]'></div>
                  <p className='text-[14px] text-[#0eaf62]'>Online</p>
                </div>
              </div>
              <button className='w-[95%] h-[2.5rem] rounded-[20px] mt-[1.5rem] bg-[#1c64ec] text-white'>View Website</button>
            </div>
          </div>
          <div>
            <div className='flex gap-[1.5rem]'>
              <div className='h-[8.5rem] w-[28rem] flex items-center justify-center bg-altGray rounded-[20px]'>
                <div className='w-[90%] flex flex-col gap-[15px] h-[75%]'>
                  <div className='flex gap-[10px]'>
                    <Link2 className='text-lightGray scale-[0.6]'/>
                    <div className='flex gap-[5px] items-center'>
                      <p className='text-white'>Link:</p>
                      <p className='text-[#7d9ddb] text-[14px]'>{url}</p>
                    </div>
                  </div>
                  <div className='flex gap-[10px]'>
                    <Star className='text-lightGray scale-[0.6]'/>
                    <div className='flex gap-[5px] items-center'>
                      <p className='text-white'>Rating:</p>
                      <p className='text-[#7d9ddb] text-[14px]'>4.5</p>
                      <p className='text-lightGray text-[14px]'>(15 reviews)</p>
                    </div>
                  </div>
                  <div className='flex gap-[10px]'>
                    <UserCheck className='text-lightGray scale-[0.6]'/>
                    <div className='flex gap-[5px] items-center'>
                      <p className='text-white'>Added:</p>
                      <p className='text-[#7d9ddb] text-[14px]'>11 Dec 2022</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className='h-[8.5rem] gap-[4px] product-of-day flex flex-col items-center justify-center w-[9rem] bg-[#0eaf62] rounded-[20px]'>
                <p className='w-[6rem] font-[600] text-center text-white'>Product of the day</p>
                <BsTrophy className='text-[#fff] scale-[1.3] mt-[0.5rem] text-[1.5rem]'/>
              </div>
              <div className='h-[8.5rem] gap-[4px] product-of-day flex flex-col items-center justify-center w-[9rem] bg-[#0eaf62] rounded-[20px]'>
                <p className='w-[6rem] font-[600] text-center text-white'>Liked Product</p>
                <ThumbsUp className='text-[#fff] scale-[1.2] h-[2rem]'/>
              </div>
            </div>
            <div className={`w-fit ${websiteData.title==''?'scale-[0]':'scale-[1]'} transition-all px-[2rem] flex items-center justify-center h-[5rem] rounded-[20px] mt-[1.5rem] bg-altGray`}>
              <div className='w-fit flex items-center'>
                <div className='flex gap-[1rem]'>
                  <div className='flex items-center  gap-[5px]'>
                    <FcInfo className='text-[24px]'/>
                    <p className='text-white whitespace-nowrap w-fit'>{websiteData.title}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TopProduct