import { useRef } from 'react'
import { Search, Sliders } from 'react-feather'

type Props = {}

const SearchBar = (props: Props) => {
  const searchref = useRef<HTMLInputElement>(null)

  const refHandler = () => {
    if(searchref.current !== null){
      searchref.current.focus()
    }
  }

  return (
    <div className='relative ml-[2rem]'>
      <Search onClick={refHandler}  className='absolute cursor-pointer top-[8px] left-[10px] text-white'/>
      <input ref={searchref} placeholder='Search' className="bg-[#35363a] max-w-[30rem] border-none outline-none text-white h-[2.5rem] px-[2.8rem] rounded-[30px]" />
      <Sliders  className='absolute cursor-pointer top-[10px] h-[20px] right-[10px] text-[#6c6c6c]'/>
    </div>
  )
}

export default SearchBar