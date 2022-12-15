import { useAllResources, useCompleteResourceLength } from '@/hooks/Zustand';
import {ResourceListBar, ResourceCard} from 'components'
import { useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion"

type Props = {}

const ResourceList = (props: Props) => {
  const fetchResources = useAllResources(state=>state.setAllResources)
  const {setCompleteResourceLength} = useCompleteResourceLength()
  const resources = useAllResources(state=>state.allResources)
  useEffect(()=>{
    fetchResources('all', 4)
    setCompleteResourceLength('all')
  },[])

  return (
    <div>
      <ResourceListBar/>
      <div className="w-[100%] flex justify-center">
        <div className="flex ml-[2rem] w-[95%] justify-start gap-[2rem] flex-wrap my-[1rem]">
        <AnimatePresence>
          {resources.map((e)=>{
            return (
              <motion.div
                key={e.id}
                initial={{ scale:0 }}
                animate={{ scale: 1 }}
              >
                <ResourceCard description={e.desc} title={e.title} image={e.image_url} url={e.url}/>
              </motion.div>
              )
            })}
        </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

export default ResourceList