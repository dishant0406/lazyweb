
import { AnimatePresence } from 'framer-motion';
import { useFilterUsingCategoriesArray, useFilterUsingTagsArray } from '@/hooks/Zustand';
import { motion } from 'framer-motion';
import { ResourceCard } from 'components';
import StackGrid,{easings,transitions} from 'react-stack-grid';
type Props = {}

const FilteredResources = (props: Props) => {
  const {filteredResources} = useFilterUsingCategoriesArray()
  const {filteredResources:filteredTagsResources} = useFilterUsingTagsArray()
  return (
    <div>
        <p className='text-[18px] text-white mt-[1rem] ml-[1rem]'>Filtered Resources: {filteredResources.length || filteredTagsResources.length} {filteredResources.length>1 || filteredTagsResources.length>1 ?'results':'result'}</p>
      <div className={`relative w-[100%] transition-all duration-300 flex justify-center`}>
        <div className="ml-[2rem] w-[95%] justify-start gap-[2rem] flex-wrap my-[1rem]">
        <StackGrid enter={transitions.scaleDown.enter} appear={transitions.scaleDown.appear} appeared={transitions.scaleDown.appeared} leaved={transitions.scaleDown.leaved} entered={transitions.scaleDown.entered} easing={easings.backIn} className='z-[1] mt-[2rem]' component='div' gutterHeight={10}  columnWidth={300}>
          {filteredResources.map((e)=>{
            return (
              <ResourceCard key={e.id} resource={e} description={e.desc} title={e.title} image={e.image_url} url={e.url}/>
              )
            })}
            {filteredTagsResources.map((e)=>{
            return (
              <ResourceCard key={e.id} resource={e} description={e.desc} title={e.title} image={e.image_url} url={e.url}/>
              )
            })}
        </StackGrid>
        </div>
      </div>
    </div>
  )
}

export default FilteredResources