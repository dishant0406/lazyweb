import { Resource } from '@/hooks/Zustand'
import React, { useState } from 'react'
import {BiLinkExternal} from 'react-icons/bi'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import { formatUrl } from '@/lib/formatUrl'
import { InfoModal, QrCodeModal } from 'components';
import {AiFillInfoCircle} from 'react-icons/ai'
import { useRouter } from 'next/router'
import {IoQrCode} from 'react-icons/io5'
import Image from 'next/image'

type Props = {
  resource: Resource
}


const MobileResourceCard = ({resource}: Props) => {
  const [open, setOpen] = useState(false)
  const [isInfoOpen, setIsInfoOpen] = useState(false)
  const handleGoto = ():void=>{
    window.open(formatUrl(resource.url), '_blank');
  }
  const router = useRouter()
  return (
    <div className='w-[11rem] relative h-[13rem] overflow-y-hidden rounded-xl overflow-hidden bg-altGray'>
      {/* <img src={resource.image_url}/> */}
      <div className='mb-[1.5rem]'>
      {/* <LazyLoadImage
        alt={resource.title}
        height={100}
        effect="blur"
        delayTime={1000}
        placeholderSrc="assets/placeholder-website.png"
        src={resource.image_url} // use normal <img> attributes as props
        width={200} /> */}
         <Image
            alt={resource.title}
            height={100}
            width={200}
            layout="fixed"
            placeholder="blur"
            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAA21BMVEUAssb09PSxsbH/Skqqqqry8vLv7+/z///S0tL/NTUAsMXz8/MAuc/t9fX/SEfPY2i1tbX++Pdew9G/v7/Gxsbl5eX6+vrY2Njg4OD/QD75Skpdnq//RESnp6f/OzvQ19d6lKO6eIHOZ27HcXmPiZYtrcCdhJDeWV1OpbeyeILuT1D1a2vkoaHiqKjsjIz9YWH5ra33u7v5paXcurrN39/zcnL6m5vqVFbaW1/7iYn/MDDnlZX+VVXZwMDVzMzyd3f3zMz15OT21tbh7/Cx3eR9zNeZ093K5+uBzNhz/ARFAAAD40lEQVR4nO3d63LSUBSGYQIhhACRcNgQC0FrD2prD0Krbak9WK33f0UmASqMA7hZO2Tt+D0/HOM4kHcSshJCSy4HAAAAAAAAAAAAAAAAAAAAAAAAAAAA/6cqRyrz3rzdfcXOu719RZHVA9/vuQz1gl1HSeGhX+Cq5+/QN2P1sJd2xyr+e3LgByaBbvhSWVjy3fgvH6mF+0x20eDo+NNJb9YYnJ6dfx7Hq+bvEQsPeGxCfziy7cHgYrI25fOSMGqly3K08IX2Sqx+dVMtmwqGAzsyOo1WJzgrGZHSVRTs79MKX6cdF3GPRnGgPRgG0bIxZV2HC/5OBgp7J5NNGAoL3YvStLAUrV02Cm9eCsOji3v3Ujh2M1LoXkz3Uvs22objWaERHWoyUVgIvk0CR3fRkaZ8Lyab8CyaF9kodMeDaD8d3cQHmoL/EG3F0n08LbJRWHB7x7ffhkez04/y5ePD41UcmJXCMCQI/D+z2S8HwfRcJDOFS6EQhUGZu2taoVNiTzRohQZ7HgpRyB6DQpEYLoV2Yiwuha1mIlqMCvOJqKMQhShEoV6FwupIaQvdCjumOXtc8+VPc35h/l/zptkSehUK6WfvW5oV1mWfva/bXlqs900J/Xxbt0JDzB861lv433oUUqAQhdspFEVLhn6vQ6sucygNTw+6uk38zM/D7J/TGF25ndQ0bc320vBA05ViaXdtQYJCFG6ncKP327UqtOtSWkXNCkXTXP+EC0zNpoWQDdRu4gtbMtGsa7YNDdFtSeloOPE3P5TqUkiAQhSiEIXbKJQ75ftXTT6Fmf+0idT7kFIqTAoThsItFIqKeqwKw4tL9eauzhgUyt1dTauQ8j5NEgfTud1U0V3upuQ0bhtbo+h9GtkzKlPurnj6hdLnjKa1Zr0yVSiK6rEq1OJYSixUH8irMJFpwWovTRoKUaigUGT9dZjMtGBVmMTVk8mpMDxvz/g5TdJQiEIVhdTRsPpaM/1C8pl3v7UykUEheVrYzAvJ06LCfS9NGgpRqKKwTbBmVLAopE2LfkeDQumP/S08UJd/Ie3u2ro+FoUJQyEKFRRWKNMixvy8lP6u/uqJwaBQ+ubjXw+2cmKkX2gkfLOUQWHCUIhCBYVF8rRYOTKohd/jQspPyYo8dVpMRsayA6pH+43lzpMXPYolmzj3k870aTGx7CM6NeJ3XDS8yWqufz3ME0sXNrZ0J30iFjrPStYvOSJHLcxt79NNm/B+kL+IxWlwTvR+KvimGSf37KUdsoRXayj5Kh3HaTzVOHr+5aj5rqA4kidVfQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAivwGFDhI5ov2G60AAAAASUVORK5CYII=" // Base64 encoded or SVG image data
            src={resource.image_url}
            className='rounded-t-[20px]'
          />
        <div onClick={handleGoto} style={{backgroundColor:'rgba(32, 33, 36, 0.5)'}} className='h-[2rem] absolute top-[5px] flex items-center justify-center left-[5px] w-[2rem] rounded-full'>
          <BiLinkExternal className='text-white'/>
        </div>
        <div onClick={()=>{
        setIsInfoOpen(true)
      }} className='h-[2rem] cursor-pointer w-[2rem] flex items-center justify-center rounded-full absolute bottom-[5.5rem] right-[5px] bg-[rgba(32,33,36,0.5)]'>
        <IoQrCode className="text-[18px] text-white" />
      </div>
        <div onClick={() => {
        //set url query to the resource id
        router.replace({
          pathname: '/',
          query: { id: resource._id },
        }, undefined, { shallow: true });
      }} style={{backgroundColor:'rgba(32, 33, 36, 0.5)'}} className='h-[2rem] absolute top-[5px] flex items-center justify-center right-[5px] w-[2rem] rounded-full'>
          <AiFillInfoCircle className='text-white'/>
        </div>
      </div>
      <div className='w-[11rem] mt-[-1rem] flex justify-center my-[10px]'>
        <div className='w-[90%]'>
          <h1 className='text-white font-[600]'>{resource.title.slice(0,14)}...</h1>
          <p className='text-white text-[14px] opacity-80'>{resource?.desc?.slice(0,45)}...</p>
        </div>
      </div>
      <InfoModal isOpen={open} resource={resource} setIsOpen={setOpen}/>
      <QrCodeModal isOpen={isInfoOpen} setIsOpen={setIsInfoOpen} url={formatUrl(resource.url)}/>
    </div>
  )
}

export default MobileResourceCard