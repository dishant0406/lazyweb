import {CustomCheckbox} from '../..'

type Props = {
  options:string[],
  title:string
}

const SidebarCategory = ({options, title}: Props) => {
  return (
    <div className="w-[10rem]">
      <p className="text-[16px] text-white">{title}</p>
      <div className='mt-[0.5rem] ml-[0.5rem]'>
        {options.map(e=>{
          return <CustomCheckbox key={e} name={e}/>
        })}
      </div>
    </div>
  )
}

export default SidebarCategory