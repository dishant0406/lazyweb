import { useFilterUsingCategoriesArray, useFilterUsingTagsArray } from '@/hooks/Zustand';
import { ResourceCard } from 'components';
import { useState } from 'react';
import { useEffect } from 'react';
import { ScrollPosition, trackWindowScroll } from 'react-lazy-load-image-component';
import { motion, Reorder } from 'framer-motion';
type Props = {

}

const FilteredResources = (props: Props) => {
  const { filteredResources } = useFilterUsingCategoriesArray()
  const { filteredResources: filteredTagsResources } = useFilterUsingTagsArray()


  return (
    <div>
      <p className='text-[18px] text-white mt-[1rem] ml-[1rem]'>Filtered Resources: {filteredResources.length || filteredTagsResources.length} {filteredResources.length > 1 || filteredTagsResources.length > 1 ? 'results' : 'result'}</p>
      <div className={`relative w-[100%] transition-all duration-300 flex justify-center`}>
        <div className="ml-[2rem] w-[95%] justify-start gap-[2rem] flex-wrap my-[1rem]">
          <Reorder.Group values={filteredResources} axis={'x'} onReorder={() => { }} className='z-[1] flex flex-wrap gap-[1rem] mt-[2rem]'>
            {filteredResources.map((e) => {
              return (
                <Reorder.Item key={e._id} value={e} initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}>
                  <ResourceCard key={e._id} resource={e} description={e.desc} title={e.title} image={e.image_url} url={e.url} />
                </Reorder.Item>
              )
            })}
            {filteredTagsResources.map((e) => {
              return (
                <Reorder.Item key={e._id} value={e} initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}>
                  <ResourceCard key={e._id} resource={e} description={e.desc} title={e.title} image={e.image_url} url={e.url} />
                </Reorder.Item>
              )
            })}
          </Reorder.Group>
        </div>
      </div>
    </div>
  )
}

export default FilteredResources