import { PlusCircle } from "react-feather"
import ReactTooltip from 'react-tooltip';
import { useState } from 'react';
import {CreateModal} from 'components'

type Props = {}

const CreateResource = (props: Props) => {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <div className='md:flex hidden'>
      <a data-tip data-for='create'>
        <div>
          <PlusCircle onClick={()=>setIsOpen(true)} className='text-[#6c6c6c] hover:text-[#aeaeae] transition-all cursor-pointer'/>
        </div>
      </a>
      <ReactTooltip className='bg-gray' type='warning' id='create' place='bottom'>
          add a resource
      </ReactTooltip>
      <CreateModal isOpen={isOpen} setIsOpen={setIsOpen}/>
    </div>
  )
}

export default CreateResource