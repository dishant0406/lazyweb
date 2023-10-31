import { formatUrl } from "lib/formatUrl"
import { Resource, axiosIntanceWithAuth, useAllCategory, useAllTags, useSetLikes } from "@/hooks/Zustand"
import { useEffect, useState } from "react"
import { useSetBookmark, useUserData, useSelectedTab, useAllResources, useCompleteResourceLength } from 'hooks/Zustand'
import { AnimatePresence, motion } from 'framer-motion';
import { PublishModal, InfoModal, QrCodeModal } from "components"
import { LazyLoadImage, ScrollPosition } from 'react-lazy-load-image-component';
import { FcInfo, FcLike, FcLikePlaceholder } from "react-icons/fc"
import { BsBookmarksFill } from 'react-icons/bs'
import 'react-lazy-load-image-component/src/effects/blur.css';
import { useRouter } from "next/router"
import { IoQrCode } from 'react-icons/io5';
import Image from "next/image";
import { HiOutlineExternalLink } from 'react-icons/hi'
import { event } from "nextjs-google-analytics";
import { TbEditCircle } from 'react-icons/tb'
import { HiOutlineRefresh } from 'react-icons/hi'
import { Popover, PopoverTrigger, PopoverContent, Button, Input, ButtonGroup } from "@nextui-org/react";


type Props = {
  url: string,
  title: string,
  description: string,
  image: string,
  resource: Resource,
  scrollPosition?: ScrollPosition
}

function MyImageComponent({ title, image }: {
  title: string,
  image: string
}) {
  const [currentImage, setCurrentImage] = useState(image);

  const handleImageError = () => {
    if (currentImage !== 'https://via.placeholder.com/288x160?text=Image+Not+Available') {
      setCurrentImage('https://via.placeholder.com/288x160?text=Image+Not+Available');
    }
  };

  //image changes re-render the component
  useEffect(() => {
    setCurrentImage(image)
  }, [image])

  return (
    <div className="h-[160px] w-[268px] rounded-t-[10px] overflow-hidden">

      <Image
        alt={title}
        height={160}
        width={288}
        layout="fixed"
        placeholder="blur"
        blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAA21BMVEUAssb09PSxsbH/Skqqqqry8vLv7+/z///S0tL/NTUAsMXz8/MAuc/t9fX/SEfPY2i1tbX++Pdew9G/v7/Gxsbl5eX6+vrY2Njg4OD/QD75Skpdnq//RESnp6f/OzvQ19d6lKO6eIHOZ27HcXmPiZYtrcCdhJDeWV1OpbeyeILuT1D1a2vkoaHiqKjsjIz9YWH5ra33u7v5paXcurrN39/zcnL6m5vqVFbaW1/7iYn/MDDnlZX+VVXZwMDVzMzyd3f3zMz15OT21tbh7/Cx3eR9zNeZ093K5+uBzNhz/ARFAAAD40lEQVR4nO3d63LSUBSGYQIhhACRcNgQC0FrD2prD0Krbak9WK33f0UmASqMA7hZO2Tt+D0/HOM4kHcSshJCSy4HAAAAAAAAAAAAAAAAAAAAAAAAAAAA/6cqRyrz3rzdfcXOu719RZHVA9/vuQz1gl1HSeGhX+Cq5+/QN2P1sJd2xyr+e3LgByaBbvhSWVjy3fgvH6mF+0x20eDo+NNJb9YYnJ6dfx7Hq+bvEQsPeGxCfziy7cHgYrI25fOSMGqly3K08IX2Sqx+dVMtmwqGAzsyOo1WJzgrGZHSVRTs79MKX6cdF3GPRnGgPRgG0bIxZV2HC/5OBgp7J5NNGAoL3YvStLAUrV02Cm9eCsOji3v3Ujh2M1LoXkz3Uvs22objWaERHWoyUVgIvk0CR3fRkaZ8Lyab8CyaF9kodMeDaD8d3cQHmoL/EG3F0n08LbJRWHB7x7ffhkez04/y5ePD41UcmJXCMCQI/D+z2S8HwfRcJDOFS6EQhUGZu2taoVNiTzRohQZ7HgpRyB6DQpEYLoV2Yiwuha1mIlqMCvOJqKMQhShEoV6FwupIaQvdCjumOXtc8+VPc35h/l/zptkSehUK6WfvW5oV1mWfva/bXlqs900J/Xxbt0JDzB861lv433oUUqAQhdspFEVLhn6vQ6sucygNTw+6uk38zM/D7J/TGF25ndQ0bc320vBA05ViaXdtQYJCFG6ncKP327UqtOtSWkXNCkXTXP+EC0zNpoWQDdRu4gtbMtGsa7YNDdFtSeloOPE3P5TqUkiAQhSiEIXbKJQ75ftXTT6Fmf+0idT7kFIqTAoThsItFIqKeqwKw4tL9eauzhgUyt1dTauQ8j5NEgfTud1U0V3upuQ0bhtbo+h9GtkzKlPurnj6hdLnjKa1Zr0yVSiK6rEq1OJYSixUH8irMJFpwWovTRoKUaigUGT9dZjMtGBVmMTVk8mpMDxvz/g5TdJQiEIVhdTRsPpaM/1C8pl3v7UykUEheVrYzAvJ06LCfS9NGgpRqKKwTbBmVLAopE2LfkeDQumP/S08UJd/Ie3u2ro+FoUJQyEKFRRWKNMixvy8lP6u/uqJwaBQ+ubjXw+2cmKkX2gkfLOUQWHCUIhCBYVF8rRYOTKohd/jQspPyYo8dVpMRsayA6pH+43lzpMXPYolmzj3k870aTGx7CM6NeJ3XDS8yWqufz3ME0sXNrZ0J30iFjrPStYvOSJHLcxt79NNm/B+kL+IxWlwTvR+KvimGSf37KUdsoRXayj5Kh3HaTzVOHr+5aj5rqA4kidVfQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAivwGFDhI5ov2G60AAAAASUVORK5CYII="
        src={currentImage}
        className='rounded-t-[10px] transition-all duration-300 hover:scale-125'
        onError={handleImageError}
      />
    </div>
  );
}

const ResourceCard = ({ url, title, description, image: res_image, resource, scrollPosition }: Props) => {
  const formattedUrl = formatUrl(url)
  const [isHover, setISHover] = useState(false)
  const { setBookmark, setComplete } = useSetBookmark()
  const { setComplete: setLikesComplete, setLikes } = useSetLikes()
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const { setAllResources, loading } = useAllResources()
  const { setAllCategories } = useAllCategory()
  const { setAllTags } = useAllTags()
  const { session } = useUserData()
  const { selectedTab } = useSelectedTab()
  const [isHovered, setIsHovered] = useState(false)
  const [isLikeHovered, setIsLikeHovered] = useState(false)
  const [open, setOpen] = useState(false)
  const [isInfoModalOpen, setIsInfoOpen] = useState(false)
  const router = useRouter()
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [image, setImage] = useState<string>(res_image)
  const [loadingImage, setLoadingImage] = useState(false)

  useEffect(() => {
    getBookMarked();
    getLikes();
  }, [setComplete, setLikesComplete, resource]);


  const getBookMarked = async () => {
    const bookmarked = resource.bookmarked_by.includes(session?.id!)
    setIsBookmarked(bookmarked)
  }

  const getLikes = async () => {
    //check if the user has liked the resource
    const liked = resource?.liked_by?.includes(session?.id!)
    setIsLiked(liked)
  }

  const refetchImage = async () => {
    try {
      setLoadingImage(true)
      const data = await axiosIntanceWithAuth.put(`/websites/refetch-image/${resource._id}`, {}, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      setImage(data.data.image_url)
      setIsEditOpen(false)
    }
    catch (err) {
      console.log(err)
    }
    finally {
      setLoadingImage(false)
    }
  }

  const handleBookMark = async () => {
    setBookmark(resource._id)
  }

  const handleLike = async () => {
    setLikes(resource._id)
  }

  const handleApproveOrReject = async (btnType: string) => {
    try {
      if (btnType === 'approve') {
        const data = await axiosIntanceWithAuth.put(`/websites/approve/${resource._id}`, {}, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        })
        setAllResources('publish')
        setAllCategories()
        setAllTags()
      } else {
        const data = await axiosIntanceWithAuth.put(`/websites/reject/${resource._id}`, {}, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        })
        setAllResources('publish')
        setAllCategories()
        setAllTags()
      }
    }
    catch (err) {
      console.log(err)
    }

  }

  const varients = {
    booked: { rotate: 360, scale: 1 },
    notBooked: { rotate: -360, scale: 1 }
  }

  //string capitalize function
  const capitalize = (s: string) => {
    if (typeof s !== 'string') return ''
    return s.charAt(0).toUpperCase() + s.slice(1).toLocaleLowerCase()
  }

  //calculate the top value of absolute box according to the number of tags available such that the space between the card and the box is 1 rem
  const calculateTopValue = (tags: string[]) => {
    if (tags.length <= 3) {
      return '-12rem'
    } else if (tags.length > 3 && tags.length <= 6) {
      return '-14rem'
    } else if (tags.length > 6 && tags.length <= 9) {
      return '-15rem'
    } else if (tags.length > 9 && tags.length <= 12) {
      return '-16rem'
    } else if (tags.length > 12 && tags.length <= 15) {
      return '-17rem'
    }
  }


  return (

    <div className={`w-[18rem] relative px-[0.5rem] pt-[0.5rem] transition h-[17rem] bg-[#0d0d0e] border-[3px] border-altGray rounded-[20px]`}>
      <div className="relative">
        {selectedTab === 'publish' && isHovered && !loading && (
          <div>
            <div style={{
              top: calculateTopValue(resource.tags),
            }} className={`absolute z-30 border border-lightGray right-[0rem] h-full w- p-[1rem] rounded-[20px] bg-altGray`}>
              <p className="text-white mb-[5px]">Category:</p>
              <span className="text-white rounded-2xl bg-lightGray px-[15px] py-[2px]">{capitalize(resource.category)}</span>
              <p className="text-white mt-[0.5rem]">Tags:</p>
              <div className="flex gap-[0.5rem] flex-wrap mt-[5px] ">
                {resource.tags.map((tag: string) => (
                  <span className="text-gray bg-white text-[14px] px-[10px] rounded-2xl py-[2px]">{capitalize(tag)}</span>
                ))}
              </div>

            </div>
          </div>
        )}
        {resource.created_by_list.includes(session?.id!) && !resource.isPublicAvailable && !resource.isAvailableForApproval && <div onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)} className="w-full z-[1] absolute top-[0] left-[0] transition-all flex items-center justify-center duration-500 hover:bg-gray/[0.4] h-[10.5rem] rounded-t-[10px]">
          <button onClick={() => {
            event('publish', {
              category: 'publish-resource',
              title: resource.title,
              url: resource.url,
              id: resource._id
            })
            setOpen(true)
          }} className={`text-white hover:scale-[1.05] ${isHovered ? 'opacity-100' : 'opacity-0'} transition-all  px-[15px] py-[5px] text-[16px] bg-[#1c64ec] rounded-[20px]`}>Publish</button>
        </div>}
        {session?.isAdmin && resource.isAvailableForApproval && selectedTab === 'publish' && <div onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)} className="w-[18rem] absolute top-[0] left-[0] z-[1] transition-all flex items-center justify-center gap-[5px] duration-500 hover:bg-gray/[0.4] h-[11.5rem] rounded-t-[20px]">
          <button onClick={() => {
            event('approve', {
              category: 'approve-resource',
              title: resource.title,
              url: resource.url,
              id: resource._id,
            })
            handleApproveOrReject('approve')
          }} className={`text-white hover:scale-[1.05] ${isHovered ? 'opacity-100' : 'opacity-0'} transition-all  px-[15px] py-[5px] text-[16px] bg-[#1c64ec] rounded-[20px]`}>Approve</button>
          <button onClick={() => {
            event('reject', {
              category: 'reject-resource',
              title: resource.title,
              url: resource.url,
              id: resource._id,
            })
            handleApproveOrReject('reject')
          }} className={`text-white hover:scale-[1.05] ${isHovered ? 'opacity-100' : 'opacity-0'} transition-all  px-[15px] py-[5px] text-[16px] bg-red-600 rounded-[20px]`}>Reject</button>
        </div>}
        <MyImageComponent title={title} image={image} />

      </div>
      <div className="w-[18rem] h-[6rem] mt-[-0.2rem] flex flex-col ml-[1rem] justify-center">
        <div className="flex gap-[0.5rem] items-center">
          {
            resource.created_by === session?.id && (
              <Popover isKeyboardDismissDisabled={loadingImage} shouldCloseOnBlur={loadingImage} shouldCloseOnInteractOutside={e => {
                return !loadingImage
              }} shouldBlockScroll={loadingImage} classNames={{
                trigger: 'z-0'
              }} isOpen={isEditOpen} onOpenChange={setIsEditOpen} placement="top" showArrow offset={10}>
                <PopoverTrigger>
                  <button className="outline-none">
                    <TbEditCircle title={
                      `Edit ${title}`
                    } className="text-[18px] text-white hover:scale-[1.1] cursor-pointer transition-all" />
                  </button>
                </PopoverTrigger>
                <PopoverContent>
                  <div className="my-2 flex flex-col gap-2 w-full">
                    <button onClick={() => {
                      event('refetch-image', {
                        category: 'refetch-image-resource',
                        title: resource.title,
                        url: resource.url,
                        id: resource._id,
                      })
                      refetchImage()
                    }} className="flex items-center gap-[1rem]">
                      <HiOutlineRefresh className={`${loadingImage ? 'animate-spin' : ''
                        } text-[18px] hover:scale-[1.1] cursor-pointer transition-all`} />

                      <p className="text-[14px]">
                        {
                          loadingImage ? 'Fetching Image...' : 'Refetch Image'
                        }
                      </p>
                    </button>
                  </div>
                </PopoverContent>
              </Popover>
            )
          }
          <div className="text-white truncate w-[80%] text-[16px] font-[500]">{title}</div>
        </div>
        <div className="text-[#6c6c6c] w-[90%] text-[14px]">{description?.slice(0, 55)}{description?.length > 55 && '.....'}</div>
      </div>
      <a title={
        `Visit ${title}`
      } onClick={e => {
        e.stopPropagation()
        event('visit', {
          category: 'visit-resource',
          title: resource.title,
          url: resource.url,
          id: resource._id,
        })

      }} href={
        formattedUrl
      } target="_blank" rel="noreferrer"
        className="text-white hover:scale-[1.05] transition-all absolute bottom-[10px] right-[10px] px-[5px] py-[2px] text-[12px] bg-altGray rounded-lg">
        <HiOutlineExternalLink className="text-[18px] text-white inline-block" />
      </a>
      <FcInfo title={
        `Info about ${title}`
      } onClick={() => {
        //set url query to the resource id
        event('info', {
          category: 'info-resource',
          title: resource.title,
          url: resource.url,
          id: resource._id,
        })
        router.replace({
          pathname: '/',
          query: { id: resource._id },
        }, undefined, { shallow: true });
      }} className="text-[18px] absolute bottom-[6rem] right-[5px] hover:scale-[1.1] cursor-pointer transition-all" />
      <div onClick={() => {
        event('qr-code', {
          category: 'qr-code-resource',
          title: resource.title,
          url: resource.url,
          id: resource._id,
        })
        setIsInfoOpen(true)
      }} className='h-[2rem] cursor-pointer w-[2rem] flex items-center justify-center rounded-full absolute bottom-[6rem] left-[5px] bg-[rgba(32,33,36,0.5)]'>
        <IoQrCode className="text-[18px] text-white" />
      </div>
      {session && <motion.div animate={isBookmarked ? 'booked' : 'notBooked'} variants={varients} onClick={() => {
        event('bookmark', {
          category: 'bookmark-resource',
          title: resource.title,
          url: resource.url,
          id: resource._id,
        })
        handleBookMark()
      }} onMouseEnter={() => setISHover(true)} onMouseLeave={() => setISHover(false)} className="h-[2rem] flex cursor-pointer justify-center items-center w-[2rem] absolute top-[10px] right-[10px]">
        <AnimatePresence>
          {(isHover || isBookmarked) ? (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              style={{ backgroundColor: 'rgba(32, 33, 36, 0.5)' }}
              className="text-[#92ec01] h-[2rem] w-[2rem] rounded-full flex items-center justify-center">
              <BsBookmarksFill className="text-[18px] " />
            </motion.div>
          ) : (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              style={{ backgroundColor: 'rgba(32, 33, 36, 0.5)' }}
              className="text-[#fff] h-[2rem] w-[2rem] rounded-full flex items-center justify-center">
              <BsBookmarksFill className="text-[18px] " />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>}
      {session && resource.isPublicAvailable && <motion.div animate={isLiked ? 'booked' : 'notBooked'} variants={varients} onClick={() => {
        event('like', {
          category: 'like-resource',
          title: resource.title,
          url: resource.url,
          id: resource._id,
        })
        handleLike()
      }} onMouseEnter={() => setIsLikeHovered(true)} onMouseLeave={() => setIsLikeHovered(false)} className="h-[2rem] flex cursor-pointer justify-center items-center w-[2rem] absolute top-[10px] left-[10px]">
        <AnimatePresence>
          {(isLikeHovered || isLiked) ? (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              style={{ backgroundColor: 'rgba(32, 33, 36, 0.5)' }} className="text-[#1c64ec] h-[2rem] w-[2rem] rounded-full flex items-center justify-center">
              <FcLike className="text-[18px]" />
            </motion.div>
          ) : (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              style={{ backgroundColor: 'rgba(32, 33, 36, 0.5)' }} className="text-[#6c6c6c] h-[2rem] w-[2rem] rounded-full flex items-center justify-center">
              <FcLikePlaceholder className="text-[18px] " />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>}
      <PublishModal id={resource._id} url={url} title={title} isOpen={open} setIsOpen={setOpen} />
      <InfoModal resource={resource} isOpen={
        router.query.id as string === resource._id + ''
      } setIsOpen={() => { }} />
      <QrCodeModal url={formattedUrl} isOpen={
        isInfoModalOpen
      } setIsOpen={setIsInfoOpen} />
    </div>

  )
}

export default ResourceCard