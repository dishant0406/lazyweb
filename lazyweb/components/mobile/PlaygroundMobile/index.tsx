import React from 'react'

type Props = {
  title?: string,
}

const PlaygroundMobile = ({title}: Props) => {
  return (
    <div className='h-[100vh] w-[100vw] bg-gray'>
      <div className='flex items-center relative px-[2%] justify-center h-[100vh] w-[100vw]'>
        <div className='flex flex-col items-center justify-center'>
          <div className='bg-white mb-[1rem]'>
          <img src='/assets/LogoImage.png' alt='LazyWeb Logo' className='w-[100px]  h-[100px]' />
          </div>
          <h1 className='text-4xl font-bold text-center text-white'>Desktop Only Feature!</h1>
          <p className='mt-4 text-xl text-center text-white'>
            {title || 'Playground'} is only available on desktop. Please visit this page on a desktop device to use this feature.
          </p>
        </div>
        <div className='absolute flex items-center justify-center h-[5rem] w-full bg-white rounded-t-[4rem] bottom-0'>
          <p className='text-xl font-bold text-center text-black'>Made with ❤️ by LazyWeb</p>
        </div>
        
      </div>
    </div>
  )
}

export default PlaygroundMobile