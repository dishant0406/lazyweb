
import {CategoryPill} from 'components';

type Props = {}

const Category = (props: Props) => {
  return (
    <div className="w-[100vw] border-b border-[#5e5f60] gap-[1rem] flex justify-start px-[3rem] items-center h-[60px] bg-[#202124]">
      <CategoryPill name='new'/>
      <CategoryPill name='retro'/>
      <CategoryPill name='all time favourite'/>
      <CategoryPill name='great help'/>
      <CategoryPill name='must use'/>
    </div>
  )
}

export default Category