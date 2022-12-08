import { useState } from "react"
import {X} from 'react-feather'

type Props = {
  name: string
}

const CategoryPill = ({name}: Props): JSX.Element => {
  const [selected, setSelected] = useState(false)

  const clickHandler = ():void => {
    setSelected(!selected)
  }


  return (
    <div onClick={selected ? ()=>{} : clickHandler} className={` flex items-center rounded-[20px] text-[14px] text-white h-[2rem] ${selected?`bg-[#1c64ec] ${name.length>7?'w-[8rem]':'w-[6rem]'} justify-between`:'bg-[#35363a] w-fit px-[1rem] cursor-pointer  justify-center'} `}>
      <p className={`${selected?'ml-[1rem]':''}`}>{name}</p>
      {selected && <X onClick={clickHandler} className="h-[13px] cursor-pointer mr-[4px]"/>}
    </div>
  )
}

export default CategoryPill