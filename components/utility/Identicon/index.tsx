import axios from 'axios';
import { useEffect, useState } from 'react';
import ReactTooltip from 'react-tooltip';

type Props = {
  address:string,
  className?:string,
  onClick:()=>void
}

const ProfileIcon = ({address, className, onClick}: Props):JSX.Element => {
  const [imgData, setImgData] = useState('')

  useEffect(()=>{
    (
      async ()=>{
        console.log(address)
        const {data} = await axios.post('/api/identicon',{text:address})
        setImgData(data)
      }
    )()

  },[address])

  return (
    <>
      <a data-tip data-for='info'>
        <div onClick={onClick} className={className}>
            <img src={imgData} className={`h-[2.5rem] ${imgData===''?'scale-[0]':'scale-[1]'} transition-all duration-[0.2s] p-[0.1rem] w-[2.5rem] rounded-full`} alt="profile icon" />
        </div>
      </a>
        <ReactTooltip className='bg-gray' type='warning' id='info' place='bottom'>
          {address}
        </ReactTooltip>
    </>
  )
}

export default ProfileIcon