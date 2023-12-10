import Image from "next/image"
import { useParallax } from "react-scroll-parallax"
import { BsCameraVideo } from 'react-icons/bs'
import { PiRocketLaunchLight } from 'react-icons/pi'

type Props = {}

const Hero = (props: Props) => {
  const parallax = useParallax<HTMLImageElement>({
    scale: [0.85, 1],
    translateY: [1, 0],
    startScroll: 0,
    endScroll: 210,
  })

  const handleGoto = () => {
    //href to a url using button
    window.location.href = "https://app.lazyweb.rocks"
  }

  const handleGotoVideo = () => {
    //href to a url using button
    window.open("https://www.youtube.com/watch?v=LTddiz6y1UU", "_blank")
  }

  return (
    <div>
      <div className="w-[100vw] flex justify-center">
        <div data-aos="flip-left" className="bg-white overflow-hidden mt-[5rem]">
          <img src='assets/Logo.webp' className=" h-[20vw]  md:h-[4vw]" alt="LazyWeb Logo" />
        </div>
      </div>
      <div className="w-[100vw] flex justify-center">
        <div className="w-[90vw] md:w-[50vw]">
          <h2 data-aos="fade-right" className="text-center text-white font-[600] md:mt-[2rem] mt-[1rem] md:leading-[4.5vw] leading-[8vw] text-[7vw] md:text-[3.5vw]">
            Effortlessly. Find developer resources at Lazyweb
          </h2>
          <p data-aos="fade-up" className="text-center text-white opacity-50 font-[400] md:mt-[2rem] mt-[1rem] md:leading-[1.5vw] leading-[6vw] text-[4vw] md:text-[1vw]">
            Platform that helps developers find the best resources for their projects. We have a wide range of resources that can help you build your next project.
          </p>
        </div>
      </div>
      <div className="w-[100vw] md:mt-0 mt-[1rem] flex gap-[2rem] flex-col items-center">
        <div data-aos="zoom-out" className="w-[70vw] md:w-[50vw] flex md:flex-row flex-col justify-center md:gap-[2rem] gap-[1rem] md:mt-[3rem] mt-[1rem]">
          <button onClick={handleGotoVideo} className="bg-[#0d0d0e] shadow-xl hover:scale-[1.03] transition-all duration-300 flex items-center justify-center font-medium text-white rounded-lg px-[20px] h-[50px] whitespace-nowrap">
            Watch Video
            <BsCameraVideo className="inline text-white h-[25px] w-[25px] ml-[10px]" />
          </button>
          <button onClick={handleGoto} className="bg-white shadow-xl hover:scale-[1.03] transition-all duration-300 flex items-center justify-center font-medium text-gray rounded-lg px-[20px] h-[50px] whitespace-nowrap">
            Launch App
            <PiRocketLaunchLight className="inline text-[#0d0d0e] h-[25px] w-[25px] ml-[10px]" />
          </button>
        </div>
        <a href="https://www.producthunt.com/posts/lazyweb-1?utm_source=badge-featured&utm_medium=badge&utm_souce=badge-lazyweb-1" target="_blank">
          <img
            src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=379190&theme=light"
            alt="LazyWeb - The ultimate resource for developers | Product Hunt"
            style={{ width: '250px', height: '54px' }}
            width="250"
            height="54"
          />
        </a>

      </div>
      <div className="w-[100vw] flex justify-center md:mt-[3rem] mt-[2rem]">
        <div data-aos="flip-up" data-aos-delay='300' className="relative">
          <img src="assets/MacbookImage.webp" className="md:w-[80vw]  w-[90vw]" alt="Lazyweb Website ScreenShot" />
          <div style={{
            background: 'url(assets/bac-bg.webp)',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            backgroundPosition: 'center',

          }} className="absolute top-[5.5%] flex justify-center overflow-hidden items-end right-[10.7%] w-[78.4%] h-[84.5%]">
            <img ref={parallax.ref} src="assets/new-frame.png" className="w-[100%] h-[100%]" alt="Lazyweb Website ScreenShot" />
          </div>
          <div className="h-[94.5%] rounded-b-none absolute glow-div top-0 rounded-3xl left-[9.5%] w-[81%]" />
        </div>
      </div>
    </div>
  )
}

export default Hero