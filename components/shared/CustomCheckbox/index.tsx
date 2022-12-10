import { useState } from 'react';
import { Checkbox } from 'react-input-checkbox';

type Props = {
  name:string
}

const CustomCheckbox = ({name}: Props) => {
  const [checked, setChecked] = useState(false)

  return (
    <div className={checked?'text-white':'text-[#747477]'}>
      <Checkbox onChange={()=>{setChecked(!checked)}} value={checked} theme="bootstrap-checkbox">{name}</Checkbox>
    </div>
  )
}

export default CustomCheckbox