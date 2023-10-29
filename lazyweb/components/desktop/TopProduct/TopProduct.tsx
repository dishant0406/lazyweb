type Props = {
  url: string,
  unformatUrl: string
}
import { useState, useEffect } from 'react';
import moment from 'moment'
import { FcApproval, FcOpenedFolder, FcInfo } from "react-icons/fc";
import { BsTrophy } from 'react-icons/bs'
import { ThumbsUp, Link2, Star, UserCheck } from 'react-feather'
import { Resource, useTopProduct } from '@/hooks/Zustand';
import { formatUrl } from '@/lib/formatUrl';
import QrCode from 'react-qr-code'
import { event } from 'nextjs-google-analytics';

const TopProduct = ({ url, unformatUrl }: Props) => {
  const { topProduct } = useTopProduct()
  const [imgData, setImageData] = useState('')
  const [websiteData, setWebsiteData] = useState({
    title: '',
    description: '',
    image: '',
    createdAt: '',
    likes: 0
  })

  function formatDateDifference(timestamp: number) {
    const dateFromTimestamp = moment(timestamp);
    const now = moment();

    const minutesDifference = now.diff(dateFromTimestamp, 'minutes');
    const hoursDifference = now.diff(dateFromTimestamp, 'hours');
    const daysDifference = now.diff(dateFromTimestamp, 'days');
    const monthsDifference = now.diff(dateFromTimestamp, 'months');
    const yearsDifference = now.diff(dateFromTimestamp, 'years');

    if (minutesDifference === 1) {
      return '1 minute ago';
  } else if (minutesDifference < 60) {
      return minutesDifference + ' minutes ago';
  } else if (hoursDifference === 1) {
      return '1 hour ago';
  } else if (hoursDifference < 24) {
      return hoursDifference + ' hours ago';
  } else if (daysDifference === 1) {
      return '1 day ago';
  } else if (daysDifference < 30) {
      return daysDifference + ' days ago';
  } else if (monthsDifference === 1) {
      return '1 month ago';
  } else if (monthsDifference < 12) {
      return monthsDifference + ' months ago';
  } else if (yearsDifference === 1) {
      return '1 year ago';
  } else {
      return yearsDifference + ' years ago';
  }
}

  useEffect(() => {


    //use topProduct from Zustand
    if (topProduct) {
      setImageData(topProduct.image_url)
      const webData = {
        title: topProduct.title || 'Not Available',
        description: topProduct.desc || 'Not Available',
        image: topProduct.image_url || 'Not Available',
        createdAt: formatDateDifference(Number(topProduct.created_at)),
        likes: topProduct.likes || 0
      }
      setWebsiteData(webData)
    }


  }, [topProduct])

  const handleVisit = () => {
    if (topProduct) {
      window.open(formatUrl(topProduct?.url), '_blank')
    }
  }

  const [isCopied, setIsCopied] = useState(false)

  const copyToClipboard = () => {
    if ('clipboard' in navigator) {
      setIsCopied(true)
      setTimeout(() => {
        setIsCopied(false)
      }
        , 1000)
      return navigator.clipboard.writeText(topProduct?.url!)
    }
  }

  return (
    <div className='lazyweb-top-product'>
      <p className="text-white mt-[1rem] ml-[1rem]">Today's Top Product</p>
      <div className="w-[100%] flex justify-center">
        <div className="flex flex-wrap w-[95%] gap-[1.5rem] mt-[1rem]">
          <div className={`h-[15rem] ${imgData === '' ? 'scale-[0]' : 'scale-[1]'} transition-all flex items-center justify-center rounded-[10px] w-[24rem] bg-[#0d0d0e]`}>
            <div className="w-[23rem] relative flex flex-col justify-end p-[1rem] items-center h-[14rem]">
              <div style={{ backgroundImage: `url(${imgData})`, backgroundPosition: 'center', backgroundSize: 'cover', backgroundRepeat: 'no-repeat' }} className="w-full absolute top-0 h-full z-[-1] rounded-[10px]"></div>
              <div className='w-full flex rounded-lg bg-gray p-[0.5rem] items-center justify-between'>
                <div className='flex w-full items-center top_product gap-[5px]'>
                  <FcOpenedFolder />
                  {/* <p className='text-white'>{unformatUrl.length > 20 ? unformatUrl.substring(0, 17) + '...' : unformatUrl}</p> */}
                  <p className='max-w-[85%] text-white truncate'>{
                    topProduct?.url ? topProduct?.url :  'Not Available'
                  }</p>
                  <FcApproval />
                </div>
                {/* <div className='flex items-center top_product gap-[5px]'>
                  <div className='h-[10px] w-[10px] rounded-full bg-[#0eaf62]'></div>
                  <p className='text-[14px] text-[#0eaf62]'>Online</p>
                </div> */}
              </div>
              <button title={
                `Visit ${topProduct?.url ? topProduct?.url.length > 20 ? topProduct?.url.substring(0, 17) + '...' : topProduct?.url : 'Not Available'}`
              } onClick={()=>{
                event('visit-website', {
                  category: 'top-product',
                  action: 'visit-website',
                  label: topProduct?.url
                })
                handleVisit()
              }} className='w-full h-[2.5rem] rounded-[10px] mt-[0.6rem] bg-altGray text-white'>View Website</button>
            </div>
          </div>
          <div className={`${imgData === '' ? 'scale-[0]' : 'scale-[1]'}`}>
            <div className='flex flex-wrap gap-[1.5rem]'>
              <div className='h-[8.5rem] w-[28rem] flex items-center justify-center bg-[#0d0d0e] border-[5px] border-altGray rounded-[10px]'>
                <div className='w-[90%] flex flex-col gap-[15px] h-[75%]'>
                  <div className='flex gap-[10px]'>
                    <Link2 className='text-lightGray scale-[0.6]' />
                    <div className='flex gap-[5px] items-center'>
                      <p className='text-white'>Link:</p>
                      <a href={topProduct?.url ? formatUrl(topProduct?.url) : 'Not Available'} target='_blank' className='text-[#7d9ddb] transition-all text-[14px]'>{
                        topProduct?.url ? topProduct?.url.length > 20 ? topProduct?.url.substring(0, 17) + '...' : topProduct?.url : 'Not Available'
                      }</a>
                      <button className="text-white scale-[0.7] transition-all  duration-150 ml-[-5px] " onClick={()=>{
                        event('copy-link', {
                          category: 'top-product',
                          action: 'copy-link',
                          label: topProduct?.url
                        })
                        copyToClipboard()
                      }}>
                        {isCopied ? <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-6 h-6 text-green-400">
                          <path fillRule="evenodd" d="M18 5.25a2.25 2.25 0 00-2.012-2.238A2.25 2.25 0 0013.75 1h-1.5a2.25 2.25 0 00-2.238 2.012c-.875.092-1.6.686-1.884 1.488H11A2.5 2.5 0 0113.5 7v7h2.25A2.25 2.25 0 0018 11.75v-6.5zM12.25 2.5a.75.75 0 00-.75.75v.25h3v-.25a.75.75 0 00-.75-.75h-1.5z" clipRule="evenodd" />
                          <path fillRule="evenodd" d="M3 6a1 1 0 00-1 1v10a1 1 0 001 1h8a1 1 0 001-1V7a1 1 0 00-1-1H3zm6.874 4.166a.75.75 0 10-1.248-.832l-2.493 3.739-.853-.853a.75.75 0 00-1.06 1.06l1.5 1.5a.75.75 0 001.154-.114l3-4.5z" clipRule="evenodd" />
                        </svg>
                          : <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-6 h-6 text-[#5a5b5d] ">
                            <path fillRule="evenodd" d="M15.988 3.012A2.25 2.25 0 0118 5.25v6.5A2.25 2.25 0 0115.75 14H13.5v-3.379a3 3 0 00-.879-2.121l-3.12-3.121a3 3 0 00-1.402-.791 2.252 2.252 0 011.913-1.576A2.25 2.25 0 0112.25 1h1.5a2.25 2.25 0 012.238 2.012zM11.5 3.25a.75.75 0 01.75-.75h1.5a.75.75 0 01.75.75v.25h-3v-.25z" clipRule="evenodd" />
                            <path d="M3.5 6A1.5 1.5 0 002 7.5v9A1.5 1.5 0 003.5 18h7a1.5 1.5 0 001.5-1.5v-5.879a1.5 1.5 0 00-.44-1.06L8.44 6.439A1.5 1.5 0 007.378 6H3.5z" />
                          </svg>
                        }
                      </button>
                    </div>
                  </div>
                  <div className='flex gap-[10px]'>
                    <Star className='text-lightGray scale-[0.6]' />
                    <div className='flex gap-[5px] items-center'>
                      <p className='text-white'>Likes:</p>
                      <p className='text-[#7d9ddb] mt-[3px] text-[14px]'>{websiteData.likes}</p>
                    </div>
                  </div>
                  <div className='flex gap-[10px]'>
                    <UserCheck className='text-lightGray scale-[0.6]' />
                    <div className='flex gap-[5px] items-center'>
                      <p className='text-white'>Added:</p>
                      <p className='text-[#7d9ddb] text-[14px]'>{websiteData.createdAt}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div title={
                `Scan QR code to visit ${topProduct?.url ? topProduct?.url.length > 20 ? topProduct?.url.substring(0, 17) + '...' : topProduct?.url : 'Not Available'}`
              } className='h-[8.5rem] gap-[4px] product-of-day flex flex-col items-center justify-center w-[8.5rem] bg-[#0d0d0e] rounded-[10px]'>
                {/* <p className='w-[6rem] font-[600] text-center text-white'>Product of the day</p>
                <BsTrophy className='text-[#fff] scale-[1.3] mt-[0.5rem] text-[1.5rem]' /> */}
                <QrCode 
                fgColor='#fff'
                bgColor='#0d0d0e'
                value={topProduct?.url ? formatUrl(topProduct?.url) : 'Not Available'} size={120} />
              </div>
              <div className='h-[8.5rem] border-[5px] border-altGray gap-[4px] product-of-day flex flex-col items-center justify-center w-[8.5rem] bg-[#0d0d0e] rounded-[10px]'>
                <p className='w-[6rem] font-[600] text-center text-white'>Product of the Day</p>
                <ThumbsUp className='text-[#fff] scale-[1.2] h-[2rem]' />
              </div>
            </div>
            <div className={`w-fit ${websiteData.title == '' ? 'scale-[0]' : 'scale-[1]'} transition-all px-[2rem] flex items-center justify-center h-[5rem] rounded-[10px] mt-[1.5rem] border-[5px] border-altGray bg-[#0d0d0e]`}>
              <div className='flex items-center w-fit'>
                <div className='flex gap-[1rem]'>
                  <div className='flex items-center  gap-[5px]'>
                    <FcInfo className='text-[24px]' />
                    <p className='text-white w-[45vw] truncate'>{websiteData.description}</p>
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