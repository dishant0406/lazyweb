import { useAllResources, useCompleteResourceLength, useSelectedTab } from '@/hooks/Zustand';
import {ResourceListBar, ResourceCard} from 'components'
import { useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion"
import { emojiGenerator } from 'lib/emojiGenerator';
import StackGrid, {easings,transitions} from 'react-stack-grid';

type Props = {}

const ResourceList = (props: Props) => {
  const fetchResources = useAllResources(state=>state.setAllResources)
  const {setCompleteResourceLength} = useCompleteResourceLength()
  const {allResources:resources, loading} = useAllResources()
  const {selectedTab} = useSelectedTab()
  useEffect(()=>{
    fetchResources('all', 8)
    setCompleteResourceLength('all')
  },[])


  return (
    <div>
      <ResourceListBar/>
      <div className={`relative w-[100%] transition-all duration-300 ${loading ? 'animate-pulse':''} justify-center`}>
        {resources.length>=1 && <StackGrid enter={transitions.scaleDown.enter} appear={transitions.scaleDown.appear} appeared={transitions.scaleDown.appeared} leaved={transitions.scaleDown.leaved} entered={transitions.scaleDown.entered} easing={easings.backIn} className='z-[1] mt-[2rem]' component='div' gutterHeight={10}  columnWidth={300}>
          {resources.map((e)=>{
            return (
              <ResourceCard key={e.id} resource={e} description={e.desc} title={e.title} image={e.image_url} url={e.url}/>
              )
            })} 
        </StackGrid>}
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
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-lightGray"></div>
          </div>
          }
        </div>
      </div>
    </div>
  )
}

export default ResourceList