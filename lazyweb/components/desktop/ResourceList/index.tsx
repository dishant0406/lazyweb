import { useAllResources, useCompleteResourceLength, useSelectedTab } from '@/hooks/Zustand';
import {ResourceListBar, ResourceCard} from 'components'
import { useEffect } from 'react';
import { motion, AnimatePresence, Reorder } from "framer-motion"
import { emojiGenerator } from 'lib/emojiGenerator';
import { trackWindowScroll } from 'react-lazy-load-image-component';
import { ScrollPosition } from 'react-lazy-load-image-component';

type Props = {
  scrollPosition:ScrollPosition
}

const ResourceList = ({scrollPosition}: Props) => {
  const fetchResources = useAllResources(state=>state.setAllResources)
  const {setCompleteResourceLength} = useCompleteResourceLength()
  const {allResources:resources, loading} = useAllResources()
  const {selectedTab} = useSelectedTab()
  useEffect(()=>{
    fetchResources('all')
    setCompleteResourceLength('all')
  },[])

  return (
    <div>
      <ResourceListBar/>
      <div className={`relative w-[100%] transition-all duration-300 ${loading ? 'animate-pulse':''} justify-center`}>
        {resources.length>=1 && <Reorder.Group values={resources} axis={'x'} onReorder={()=>{}} className='z-[1] ml-[3rem] flex gap-[1rem] flex-wrap mt-[2rem]'>
          {resources.map((e)=>{
            return (
              <Reorder.Item key={e._id} value={e} initial={{ scale:0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}>
                <ResourceCard scrollPosition={scrollPosition} key={e._id} resource={e} description={e.desc} title={e.title} image={e.image_url} url={e.url}/>
              </Reorder.Item>
              )
            })} 
        </Reorder.Group>}
        <div className="flex ml-[2rem] w-[95%] justify-start gap-[2rem] flex-wrap my-[1rem]">
        <AnimatePresence>
        {resources.length<1 && !loading && (
              <motion.div
              initial={{ scale:0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }} className="w-[100%] mt-[2rem] flex items-center justify-center">
                <div className='px-[3rem] py-[1rem] shadow-2xl bg-altGray rounded-[20px]'>
                  <p className="text-[18px] text-white">
                    {selectedTab==='saved' && `Not Bookmarked even a single resource! ${emojiGenerator()}` }
                    {selectedTab==='my' && `Add your personal resource and get started! ${emojiGenerator()}` }
                    {selectedTab==='all' && 'No Resources Found! '}
                    {selectedTab==='publish' && `This place is empty right now! ${emojiGenerator()}` }
                  </p>
                </div>
              </motion.div>
            )}
        </AnimatePresence>
        {loading && selectedTab==='my' && <div className="w-[100%] mb-[2rem] flex items-center justify-center">
          <div className="w-16 h-16 border-b-2 rounded-full animate-spin border-lightGray"></div>
          </div>
          }
        </div>
      </div>
    </div>
  )
}

export default trackWindowScroll(ResourceList)