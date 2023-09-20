import { useEffect, useState } from "react"
import {X} from 'react-feather'
import { emojiGenerator } from "lib/emojiGenerator"
import { useManageSelectedTags } from "@/hooks/Zustand"
import { event } from "nextjs-google-analytics"

type Props = {
  name: string
}

const CategoryPill = ({name}: Props): JSX.Element => {
  const [selected, setSelected] = useState(false)
  const [emoji, setEmoji] = useState('')
  const {selectedTags,setSelectedTags} = useManageSelectedTags()
  

  const clickHandler = ():void => {
    setSelectedTags(name.toLocaleLowerCase())
  }

  useEffect(()=>{
    if(selectedTags.includes(name.toLocaleLowerCase())){
      setSelected(true)
    }else{
      setSelected(false)
    }
  },[selectedTags])

  useEffect(()=>{
    const emoji = emojiGenerator()
    setEmoji(emoji)
  },[])

  if(emoji==''){
    return <div></div>
  }


  return (
    <div onClick={()=>{
      event('select-category', {
        category: name,
        action: 'select-category',
        label: name
      })
      //selected ? ()=>{} : clickHandler
      if(selected){
        return
      }
      clickHandler()
    }} className={` flex select-none whitespace-nowrap items-center relative transition-all rounded-[20px] text-[14px] w-fit px-[1rem] text-white h-[2rem] ${selected?`bg-[#1c64ec] justify-between`:'bg-[#35363a] cursor-pointer  justify-center'} `}>
      <p className={`transition-all whitespace-nowrap text-white ${selected?'mr-[1rem]':''}`}> {emoji +' '+ name}</p>
      {selected && <X onClick={()=>{
        event('remove-category', {
          category: name,
          action: 'remove-category',
          label: name
        })
        clickHandler()
      }} className="h-[13px] absolute right-[0] cursor-pointer mr-[4px]"/>}
    </div>
  )
}

export default CategoryPill