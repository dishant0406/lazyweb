import { PlusCircle } from "react-feather"
import ReactTooltip from 'react-tooltip';
import { useState } from 'react';
import {CreateModal} from 'components'
import {useUserData} from 'hooks/Zustand'

type Props = {}

const CreateResource = (props: Props) => {
  const [isOpen, setIsOpen] = useState(false)
  const {session} = useUserData()
  return (
    <div className='flex flex-col'>
      <a data-tip data-for='create'>
        <div className='flex flex-col items-center'>
          <PlusCircle onClick={()=>session && setIsOpen(true)} className='text-[#6c6c6c] hover:text-[#aeaeae] lazyweb-add transition-all cursor-pointer'/>
          <span className='text-[#6c6c6c] mt-[3px] md:hidden flex text-[12px]'>Add</span>
        </div>

      </a>
      <div className="md:flex hidden">
        <ReactTooltip className='bg-gray' type='warning' id='create' place='bottom'>
            add a resource
        </ReactTooltip>
      </div>
      <CreateModal isOpen={isOpen} setIsOpen={setIsOpen}/>
    </div>
  )
}

export default CreateResource