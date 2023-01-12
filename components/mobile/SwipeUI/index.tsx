type Props = {}
import { useAllResources } from 'hooks/Zustand';
import React, { useState, useRef, useMemo } from 'react';
import { BsFilter } from 'react-icons/bs';
import { MdOutlineSaveAlt } from 'react-icons/md';
import {MobileResourceCard} from 'components';

const SwipeUI = (props: Props) => {
  const {allResources} = useAllResources()

  return (
    <div className='min-h-[100vh] w-[100vw] flex-col md:hidden flex bg-gray'>
     <div className='h-[70px] flex items-end w-[100vw] justify-center'>
      <div className='h-fit w-[9rem] bg-white'>
          <img src='assets/Logo.png'/>
      </div>
     </div>
     <div className='w-[100vw] flex gap-[1rem] mt-[1rem] justify-center'>
       <button className='text-white flex items-center justify-center gap-[5px] bg-altGray h-[3rem] rounded-xl w-[8rem]'>
        <MdOutlineSaveAlt className='text-white'/>
        Saved
        </button>
       <button className='text-white flex items-center justify-center gap-[5px] bg-altGray h-[3rem] rounded-xl w-[8rem]'>
        <BsFilter className='text-white'/>
        Filter
        </button>
     </div>

     <div className='my-[2rem] w-[100vw] gap-[10px] flex justify-center flex-wrap'>
        {
          allResources.map((resource, index) => {
            return (
              <MobileResourceCard
                key={index}
                resource={resource}
              />
            )
          })
        }
     </div>
    </div>
  )
}

export default SwipeUI