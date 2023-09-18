import { useAllResources, useCompleteResourceLength, useSelectedTab, useUserData } from '@/hooks/Zustand';
import { ResourceListBar, ResourceCard, QrCodeModal } from 'components'
import {IoQrCode} from 'react-icons/io5'
import { motion, AnimatePresence, Reorder, useAnimation } from "framer-motion"
import { emojiGenerator } from 'lib/emojiGenerator';
import {FiShare2} from 'react-icons/fi'
import { useState } from 'react';

type Props = {

}

const ResourceList = (props: Props) => {
  const fetchResources = useAllResources(state => state.setAllResources)
  
  const { allResources: resources, loading } = useAllResources()
  const { selectedTab } = useSelectedTab()
  const [isCopied, setIsCopied] = useState(false);
  const {session} = useUserData()
  const [isQrCodeModalOpen, setIsQrCodeModalOpen] = useState(false)

  const slideIn = {
    initial: { y: "-100%", opacity: 0 },
    animate: { y: "0%", opacity: 1 },
    exit: { y: "-100%", opacity: 0 }
  };


  const controls = useAnimation();



  return (
    <div>
      <ResourceListBar />
      {
        (selectedTab === 'saved') && (
          <motion.div
            className='w-full mt-[1rem] flex gap-[1rem] justify-end px-[3rem]'
            initial={slideIn.initial}
            animate={slideIn.animate}
            exit={slideIn.exit}
          >
            <div className='px-[1rem] relative py-[0.2rem] border-[3px] border-white rounded-[10px] flex items-center'>
              <p className='text-[14px] mr-[3rem] text-white'>
                {
                  // current url
                  window.location.href + `?bookmark=${session?.id}`
                }
              </p>
              <div className='absolute right-[10px]'>
                <p className='text-[12px] text-white cursor-pointer' onClick={() => {
                  navigator.clipboard.writeText(window.location.href + `?bookmark=${session?.id}`)
                  setIsCopied(true)
                  setTimeout(() => {
                    setIsCopied(false)
                  }, 2000)
                }
                }>
                  {
                    isCopied ? 'Copied!' : 'Copy'
                  }
                </p>
              </div>

            </div>
            <button onClick={() => {
              navigator.share({
                title: 'Bookmarked Resources',
                url: window.location.href + `?bookmark=${session?.id}`
              });
            }} className='px-[1rem] py-[0.5rem] rounded-[5px] bg-[#0d0d0e] text-white text-[14px]'>
              Share
              <FiShare2 className='inline ml-[0.5rem] text-[18px] text-white' />
            </button>
            <button onClick={() => {
              setIsQrCodeModalOpen(true)
            }} className='px-[0.5rem] py-[0.5rem] rounded-[5px] bg-[#0d0d0e] text-white text-[14px]'>
              
              <IoQrCode className='inline text-[18px] text-white' />
            </button>
          </motion.div>
        )
      }
      <div className={`relative w-[100%] transition-all duration-300 ${loading ? 'animate-pulse' : ''} justify-center`}>
        {resources.length >= 1 && <Reorder.Group values={resources} axis={'x'} onReorder={() => { }} className='z-[1] ml-[3rem] flex gap-[1rem] flex-wrap mt-[2rem]'>
          {resources.map((e) => {
            return (
              <Reorder.Item key={e._id} value={e} initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}>
                <ResourceCard key={e._id} resource={e} description={e.desc} title={e.title} image={e.image_url} url={e.url} />
              </Reorder.Item>
            )
          })}
        </Reorder.Group>}
        <div className="flex ml-[2rem] w-[95%] justify-start gap-[2rem] flex-wrap my-[1rem]">
          <AnimatePresence>
            {resources.length < 1 && !loading && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }} className="w-[100%] mt-[2rem] flex items-center justify-center">
                <div className='px-[3rem] py-[1rem] shadow-2xl bg-altGray rounded-[20px]'>
                  <p className="text-[18px] text-white">
                    {selectedTab === 'saved' && `Not Bookmarked even a single resource! ${emojiGenerator()}`}
                    {selectedTab === 'my' && `Add your personal resource and get started! ${emojiGenerator()}`}
                    {selectedTab === 'all' && 'No Resources Found! '}
                    {selectedTab === 'publish' && `This place is empty right now! ${emojiGenerator()}`}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          {loading && selectedTab === 'my' && <div className="w-[100%] mb-[2rem] flex items-center justify-center">
            <div className="w-16 h-16 border-b-2 rounded-full animate-spin border-lightGray"></div>
          </div>
          }
        </div>
      </div>
      <QrCodeModal isOpen={isQrCodeModalOpen} setIsOpen={setIsQrCodeModalOpen} url={window.location.href + `?bookmark=${session?.id}`} />
    </div>
  )
}

export default ResourceList