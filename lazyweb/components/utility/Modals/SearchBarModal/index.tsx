import { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { Resource, axiosInstance } from '@/hooks/Zustand';
import {PiMagicWandLight} from 'react-icons/pi'
import { formatUrl } from '@/lib/formatUrl';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { useAllResources, useCompleteResourceLength, useSelectedTab } from '@/hooks/Zustand';
import {ResourceListBar, ResourceCard, MobileResourceCard} from 'components'
import { useEffect } from 'react';
import { motion, AnimatePresence, Reorder } from "framer-motion"
import { emojiGenerator } from 'lib/emojiGenerator';
import { trackWindowScroll } from 'react-lazy-load-image-component';
import { ScrollPosition } from 'react-lazy-load-image-component';
import { isDesktop } from 'react-device-detect';

type Props = {
  isOpen: boolean,
  setIsOpen: (argo:boolean)=>void,
}

const capitalize = (s:string) => {
  if (typeof s !== 'string') return ''
  return s.charAt(0).toUpperCase() + s.slice(1).toLocaleLowerCase()
}


const SearchBarModal = ({isOpen, setIsOpen}:Props) => {
  const [search, setSearch] = useState('')
  const [resources, setResources] = useState<Resource[]>([])
  const [loading, setLoading] = useState(false)
  function closeModal() {
    setIsOpen(false)
    setSearch('')
    setResources([])
  }

  function openModal() {
    setIsOpen(true)
  }

  const handleSubmit = async (e:React.FormEvent<HTMLFormElement>)=>{
    e.preventDefault()
    try{
      setLoading(true)
      const {data} = await axiosInstance.post('/websites/search', {
        desc: search
      })
      const {resources} : {
        resources:Resource[]
      } = data
      setResources(resources)
    }catch(err:any){
      toast.error(err.message || 'Something went wrong')
    }
    setLoading(false)
  }


  return (
    <Transition appear 
      show={isOpen} 
      as={Fragment}
      enter="transition duration-100 ease-out"
    >
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-75" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex justify-center min-h-full p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="md:min-w-[80vw] min-w-[100vw]  h-auto transform bg-none overflow-hidden rounded-2xl md:p-6 p-2 text-left align-middle shadow-xl transition-all">
                  <form onSubmit={handleSubmit} className='relative'>
                    <input value={search} onChange={(e)=>setSearch(e.target.value)} type="text" className='w-full h-[60px] text-white rounded-[40px] border-white bg-gray border-2 outline-none px-[2rem] pr-[3rem] md:pr-[2rem] md:px-[2rem]' placeholder={
                      isDesktop ? 'I want to add this to my website...':'Search with AI'
                    }/>
                    <div className='absolute right-[1rem] top-[25%]'>
                      <button  className='text-white'>
                        <PiMagicWandLight className='text-sky-400 h-[2rem] w-[2rem]'/>
                      </button>
                    </div>
                    {isDesktop && <div className="absolute right-4 bottom-[-2.8rem] bg-gray-800 p-2 rounded-md shadow-lg">
                      <kbd className="px-2 py-1 text-white bg-gray-900 border border-gray-700 rounded">
                          esc
                      </kbd> 
                      <span className="ml-2 text-trueGray-200">to close</span>
                  </div>}
                    {!isDesktop && <div onClick={closeModal} className="absolute cursor-pointer right-4 bottom-[-2.8rem] bg-gray-800 p-2 rounded-md shadow-lg">
                      <span className="ml-2 text-trueGray-200">Close</span>
                  </div>}

                  </form>
                  {
                    loading && <div className="w-[100%] mt-[30vh] flex items-center justify-center">
                     <div className='bg-white' id='logo'>
                  <img src='assets/LogoImage.png'/>
                  </div>
                    </div>
                  }

                  <div className='mt-[3rem] w-full'>
                  {resources.length>=1 && !loading && <Reorder.Group values={resources} axis={'x'} onReorder={()=>{}} className='z-[1] md:ml-[3rem] flex gap-[1rem] flex-wrap mt-[2rem]'>
                    {resources.map((e)=>{
                      return (
                        <Reorder.Item key={e._id} value={e} initial={{ scale:0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}>
                          {isDesktop && <ResourceCard  key={e._id} resource={e} description={e.desc} title={e.title} image={e.image_url} url={e.url}/>}
                          {!isDesktop && <MobileResourceCard key={e._id} resource={e} />}
                        </Reorder.Item>
                        )
                      })} 
                  </Reorder.Group>}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
  )
}

export default SearchBarModal