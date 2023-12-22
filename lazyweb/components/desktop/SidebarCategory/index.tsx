import {CustomCheckbox} from 'components'
import { event } from 'nextjs-google-analytics';
import { useState, useEffect } from 'react';
import {ChevronDown} from 'react-feather'

type Props = {
  options:string[],
  title:string
}

const SidebarCategory = ({options, title}: Props) => {
  const [expanded, setExpanded] = useState(true)
  const [size, setSize] = useState(`h-[${options.length*30}px]`)

  if(!size){
    return <div></div>
  }


  return (
    <div className="w-[10rem] lazyweb-category">
      <button onClick={()=>{
        event('expand-category', {
          category: title,
          action: 'expand-category',
          label: title
        })
        setExpanded(!expanded)
      }} className="text-[16px] gap-[5px] flex items-center cursor-pointer text-white">
        {title}
        <ChevronDown className={`transition-all mt-[3px] text-[#747477] h-[16px] ${expanded?'transform rotate-180':''}`}/>
      </button>
      <div className={`mt-[0.5rem] flex flex-col transition-all ml-[0.5rem]`}>
        {options.map(e=>{
          return <CustomCheckbox expanded={expanded} key={e} name={e}/>
        })}
      </div>
    </div>
  )
}

export default SidebarCategory