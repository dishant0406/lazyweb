import Image from 'next/image'
import { useState } from 'react'
import { FcAddImage, FcApproval, FcBookmark, FcIdea } from 'react-icons/fc'
import App from '../../pages/_app';
import { PiRocketLaunchLight } from 'react-icons/pi';
type Props = {}

const FeatureDetails = (props: Props) => {
  const [selectedImage, setSelectedImage] = useState('assets/feat-1.webp')
  const [Tabs, setTabs] = useState([
    {
      id: 1,
      title: '90+ Resources',
      icon: <FcApproval className="md:text-[1.8rem] text-[1.4rem]" />,
      selected: true,
      image: 'assets/feat-1.webp'
    },
    {
      id: 2,
      title: 'Add your resource',
      icon: <FcAddImage className="md:text-[1.8rem] text-[1.4rem]" />,
      selected: false,
      image: 'assets/feat-2.webp'
    },
    {
      id: 3,
      title: 'Bookmark favourite resources',
      icon: <FcBookmark className="md:text-[1.8rem] text-[1.4rem]" />,
      selected: false,
      image: 'assets/feat-3.webp'
    },
    {
      id: 4,
      title: 'Top Product every day',
      icon: <FcIdea className="md:text-[1.8rem] text-[1.4rem]" />,
      selected: false,
      image: 'assets/lazyweb-ss-2.webp'
    },

  ])

  const handleSelect = (id: number, image: string) => {
    setTabs(Tabs.map((tab) => {
      if (tab.id === id) {
        tab.selected = true
      } else {
        tab.selected = false
      }
      return tab
    }
    ))
    setSelectedImage(image)
  }

  const handleGoto = () => {
    //href to a url using button
    window.location.href = "https://app.lazyweb.rocks"
  }
  return (
    <div>
      <div className="w-[100vw] bg-black md:p-[4rem] p-[2rem] mb-[2rem] mt-[4rem] flex-col flex items-center">
        <h1 data-aos="flip-up" className="text-white md:text-[3vw] text-[7vw] font-medium text-center md:mb-[2rem]">
          Stay tuned. <br />Our feature buffet is just getting started!
        </h1>
      </div>
      <div className="w-[100vw] md:p-[4rem] p-[2rem] mb-[2rem] flex-col flex items-center">
        <h1 data-aos="fade-left" className="text-white md:text-[3vw] text-[7vw] font-medium text-center">
          What are you waiting for?
        </h1>
        <p data-aos="fade-right" className="text-white md:text-[1vw] text-[4vw] opacity-50 font-medium text-center mt-[0.5rem]">
          Join the community and start exploring!
        </p>
        <div data-aos="flip-up" className='min-h-[40vh] w-[90%] p-[2rem] flex flex-col items-center justify-center md:w-[50%] mt-[3rem] rounded-2xl bg-altGray'>
          <div className='bg-white glow-div-2'>
            <Image src={'/assets/Logo.webp'} width={50} height={50} alt='Lazyweb Logo' />
          </div>
          <p className="text-white md:text-[1.5vw] text-[5vw]  font-medium text-center mt-[2rem]">
            Get Started
          </p>
          <p className="text-white md:text-[1vw] text-[3vw] opacity-50 text-center mt-[0.5rem]">
            Launch your next project in minutes, with our wide range of resources.
          </p>
          <button onClick={handleGoto} className="bg-[#0d0d0e] mt-[2rem] shadow-xl hover:scale-[1.03] transition-all duration-300 flex items-center justify-center font-medium text-white rounded-lg px-[20px] h-[50px] whitespace-nowrap">
            Launch App
            <PiRocketLaunchLight className="inline text-white h-[25px] w-[25px] ml-[10px]" />

          </button>
        </div>
      </div>
    </div>
  )
}

export default FeatureDetails