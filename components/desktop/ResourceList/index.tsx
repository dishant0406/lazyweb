import { useAllResources, useCompleteResourceLength, useSelectedTab } from '@/hooks/Zustand';
import {ResourceListBar, ResourceCard} from 'components'
import { useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion"

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
      <div className={`relative w-[100%] transition-all duration-300 ${loading ? 'opacity-[0.1]':'opacity-[1]'} flex justify-center`}>
        <div className="flex ml-[2rem] w-[95%] justify-start gap-[2rem] flex-wrap my-[1rem]">
        <AnimatePresence>
          {resources.map((e)=>{
            return (
              <motion.div
                key={e.id}
                initial={{ scale:0 }}
                animate={{ scale: 1 }}
              >
                <ResourceCard resource={e} description={e.desc} title={e.title} image={e.image_url} url={e.url}/>
              </motion.div>
              )
            })}
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