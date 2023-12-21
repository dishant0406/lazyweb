
import { useAllTags } from 'hooks/Zustand';
import { CategoryPill } from 'components';
import { useEffect } from 'react';

type Props = {}



const Category = (props: Props) => {
  const { allTags, setAllTags } = useAllTags()

  useEffect(() => {
    setAllTags()
  }, [])
  return (
    <div className='pt-[70px] '>
      <div id='style-4' className="w-[100vw] lazyweb-tags overflow-x-scroll border-b border-[#5e5f60] gap-[1rem] flex justify-start px-[3rem] items-center h-[60px] bg-[#202124]">

        {
          allTags.length > 0 && allTags.map((tag) => {
            return <CategoryPill key={tag} name={tag} />
          })
        }
      </div>
    </div>
  )
}

export default Category