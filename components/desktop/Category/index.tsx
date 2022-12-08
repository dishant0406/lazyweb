
import {CategoryPill} from '../../';

type Props = {}

const Category = (props: Props) => {
  return (
    <div className="w-[100vw] border-b border-[#5e5f60] gap-[1rem] flex justify-start px-[3rem] items-center h-[60px] bg-[#202124]">
      <CategoryPill name='😁 github'/>
      <CategoryPill name='😉 tools'/>
      <CategoryPill name='🐿 css'/>
      <CategoryPill name='🐱‍👤 html'/>
      <CategoryPill name='😪 javascript'/>
    </div>
  )
}

export default Category