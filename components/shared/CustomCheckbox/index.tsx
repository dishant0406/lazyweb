import { useState } from 'react';
import { Checkbox } from 'react-input-checkbox';

type Props = {
  name:string,
  expanded:Boolean
}

const CustomCheckbox = ({name, expanded}: Props) => {
  const [checked, setChecked] = useState(false)

  return (
    <div className={`${checked?'text-white':'text-[#747477]'} transition-all ${expanded?'h-[30px]':'h-[0]'} `}>
      {expanded && <Checkbox onChange={()=>{setChecked(!checked)}} value={checked} theme="bootstrap-checkbox">{name}</Checkbox>}
    </div>
  )
}

export default CustomCheckbox