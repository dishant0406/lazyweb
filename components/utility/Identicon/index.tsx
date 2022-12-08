import axios from 'axios';
import { useEffect, useState } from 'react';

type Props = {
  address:string,
  className?:string
}

const ProfileIcon = ({address, className}: Props):JSX.Element => {
  const [imgData, setImgData] = useState('')

  useEffect(()=>{
    (
      async ()=>{
        const {data} = await axios.post('/api/identicon',{text:address})
        setImgData(data)
      }
    )()

  },[])

  return <div className={className} >
    {imgData!=='' && <img src={imgData} className='h-[2.5rem] p-[0.1rem] w-[2.5rem] rounded-full' alt="profile icon" />}
  </div>
}

export default ProfileIcon