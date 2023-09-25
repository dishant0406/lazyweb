import Image from 'next/image'
import React from 'react'
import { HiOutlineSearchCircle } from 'react-icons/hi'
import { RiJavascriptLine } from 'react-icons/ri'

type Props = {}

const WhyLazyweb = (props: Props) => {
  return (
    <>
      <div id='services' data-aos="fade-up" className='w-full flex flex-col items-center mt-[5rem]'>
        <h1 className='text-center md:w-full w-[95%] md:text-[3.5vw] text-[7vw] font-[600] text-white'>
          Simplify your workflow with Lazyweb<br /> Enhance your productivity
        </h1>
        <p className='text-center md:w-[70vw] md:text-[1.2vw] w-[95%] opacity-50 text-[4vw] font-[400] text-white mt-[1rem]'>
          Lazyweb is a platform that helps developers find the best resources for their projects. We have a wide range of resources that can help you build your next project.
        </p>
      </div>
      <div className='flex md:flex-row flex-col items-center w-[100vw] justify-between md:px-[10vw] gap-[2rem] mt-[3rem] md:mt-[5rem]'>

        <div className='md:w-[30vw] w-[90vw] justify-center flex flex-col items-center md:items-start'>
          <h2 data-aos="fade-up" className='md:text-start text-center flex items-center justify-center gap-[1rem] md:text-[1.5vw] text-[5vw]  text-white '>
            <HiOutlineSearchCircle className='md:text-[2.2vw] text-[7vw] rounded-lg text-gray p-[0.2rem] bg-white' />
            Search
          </h2>
          <h2 data-aos="fade-up" className='md:text-start text-center md:text-[2.5vw] text-[6vw] font-[600] text-white  mt-[0.5rem]'>
            Search for resources using AI
          </h2>
          <h2 data-aos="fade-up" className='md:text-start text-center opacity-50 text-white md:text-[1.25vw]  mt-[1rem]'>
            Just type in what you are looking for and we will find the best resources for you.
          </h2>
        </div>
        <div className='relative flex flex-col md:scale-[1] scale-[0.85] md:mt-[0] mt-[-2rem] items-center overflow-hidden'>
          <Image src='/assets/grad-1.webp' width={500} height={500} className='rounded-3xl' alt='Lazyweb Website ScreenShot' />
          <Image data-aos="fade-left" src='/assets/search1.png' width={500} height={500} className='absolute top-[10%] shadow-[0_2.8px_2.2px_rgba(0,_0,_0,_0.034),_0_6.7px_5.3px_rgba(0,_0,_0,_0.048),_0_12.5px_10px_rgba(0,_0,_0,_0.06),_0_22.3px_17.9px_rgba(0,_0,_0,_0.072),_0_41.8px_33.4px_rgba(0,_0,_0,_0.086),_0_100px_80px_rgba(0,_0,_0,_0.12)] left-[10%] rounded-[60px]' alt='Lazyweb Website ScreenShot' />
          <Image data-aos="fade-right" src='/assets/search2.png' width={500} height={500} className='absolute bottom-[10%] right-[10%] shadow-[0_2.8px_2.2px_rgba(0,_0,_0,_0.034),_0_6.7px_5.3px_rgba(0,_0,_0,_0.048),_0_12.5px_10px_rgba(0,_0,_0,_0.06),_0_22.3px_17.9px_rgba(0,_0,_0,_0.072),_0_41.8px_33.4px_rgba(0,_0,_0,_0.086),_0_100px_80px_rgba(0,_0,_0,_0.12)] rounded-[60px]' alt='Lazyweb Website ScreenShot' />
        </div>
      </div>
      <div className='flex md:flex-row flex-col items-center w-[100vw] justify-between md:px-[10vw] gap-[2rem] mt-[3rem] md:mt-[5rem]'>
        <div className='md:w-[30vw] w-[90vw] justify-center flex md:hidden flex-col items-center md:items-start'>
          <h2 data-aos="fade-up" className='md:text-start text-center flex items-center justify-center gap-[1rem] md:text-[1.5vw] text-[5vw]  text-white '>
            <RiJavascriptLine className='md:text-[2.2vw] text-[7vw] rounded-lg text-gray p-[0.2rem] bg-white' />
            Collaborate & Code
          </h2>
          <h2 data-aos="fade-up" className='md:text-start text-center md:text-[2.5vw] text-[6vw] font-[600] text-white  mt-[0.5rem]'>
            Real Time JavaScript Playground
          </h2>
          <h2 data-aos="fade-up" className='md:text-start text-center opacity-50 text-white md:text-[1.25vw]  mt-[1rem]'>
            Real time JS playground to test your code and see the output. Create room and collaborate with your friends.
          </h2>
        </div>

        <div className='relative flex flex-col md:scale-[1] scale-[0.85] md:mt-[0] mt-[-2rem] items-center overflow-hidden'>
          <Image src='/assets/grad-2.jpg' width={500} height={500} className='rounded-3xl' alt='Lazyweb Website ScreenShot' />
          <Image data-aos="fade-left" src='/assets/play1.png' width={400} height={400} className='absolute top-[5%] shadow-[0_2.8px_2.2px_rgba(0,_0,_0,_0.034),_0_6.7px_5.3px_rgba(0,_0,_0,_0.048),_0_12.5px_10px_rgba(0,_0,_0,_0.06),_0_22.3px_17.9px_rgba(0,_0,_0,_0.072),_0_41.8px_33.4px_rgba(0,_0,_0,_0.086),_0_100px_80px_rgba(0,_0,_0,_0.12)] right-[-10%] rounded-[30px]' alt='Lazyweb Website ScreenShot' />
          <Image data-aos="zoom-out" src='/assets/play2.png' width={400} height={400} className='absolute bottom-[5%] right-[10%] shadow-[0_2.8px_2.2px_rgba(0,_0,_0,_0.034),_0_6.7px_5.3px_rgba(0,_0,_0,_0.048),_0_12.5px_10px_rgba(0,_0,_0,_0.06),_0_22.3px_17.9px_rgba(0,_0,_0,_0.072),_0_41.8px_33.4px_rgba(0,_0,_0,_0.086),_0_100px_80px_rgba(0,_0,_0,_0.12)] rounded-[30px]' alt='Lazyweb Website ScreenShot' />
        </div>
        <div className='md:w-[30vw] w-[90vw] justify-center md:flex hidden flex-col items-center md:items-start'>
          <h2 className='md:text-start text-center flex items-center justify-center gap-[1rem] md:text-[1.5vw] text-[5vw]  text-white '>
            <RiJavascriptLine className='md:text-[2.2vw] text-[7vw] rounded-lg text-gray p-[0.2rem] bg-white' />
            Collaborate & Code
          </h2>
          <h2 className='md:text-start text-center md:text-[2.5vw] text-[6vw] font-[600] text-white  mt-[0.5rem]'>
            Real Time JavaScript Playground
          </h2>
          <h2 className='md:text-start text-center opacity-50 text-white md:text-[1.25vw]  mt-[1rem]'>
            Real time JS playground to test your code and see the output. Create room and collaborate with your friends.
          </h2>
        </div>

      </div>

    </>
  )
}

export default WhyLazyweb