import React from 'react'

type Props = {}

const WhyLazyweb = (props: Props) => {
  return (
    <div className='flex md:flex-row flex-col items-center w-[100vw] justify-center gap-[2rem] mt-[3rem] md:mt-[5rem]'>
      <div className='md:w-[30vw] w-[90vw] justify-center flex flex-col items-center md:items-start'>
        <h2 className='md:text-start text-center md:text-[1.5vw] font-[600] text-blue-900 '>Why Lazyweb?</h2>
        <h2 className='md:text-start text-center md:text-[2vw] font-[600] text-gray  mt-[0.5rem]'>The ultimate resource for developers looking to save time and effort on their next project</h2>
        <h2 className='md:text-start text-center text-gray md:text-[1.25vw]  mt-[1rem]'>We are dedicated to helping developers save time and effort by providing them with a central location for finding the resources they need. So if you are looking for a particular tool or tutorial, or just want to explore what's available, we invite you to check out our collection and see what we have to offer.</h2>
      </div>
      <div className='md:w-[50vw] w-[100vw] flex flex-col items-center'>
        <img src='assets/call-image.png'/>
        </div>
    </div>
  )
}

export default WhyLazyweb