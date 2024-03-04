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
import { ImSpinner8 } from "react-icons/im";
import { MdKeyboardReturn } from "react-icons/md";
import { HiExternalLink, HiOutlineInformationCircle } from "react-icons/hi";
import { isDesktop } from 'react-device-detect';
import Image from 'next/image';

type Props = {
  isOpen: boolean,
  setIsOpen: (argo:boolean)=>void,
}

const capitalize = (s:string) => {
  if (typeof s !== 'string') return ''
  return s.charAt(0).toUpperCase() + s.slice(1).toLocaleLowerCase()
}

async function query(data: { question: string }) {
  const response = await fetch(
      "/api/search",
      {
          method: "POST",
          body: JSON.stringify(data)
      }
  );
  const responsetext = await response.json()
  console.log(responsetext)
  return responsetext.text
}



const SearchBarModal = ({isOpen, setIsOpen}:Props) => {
  const [search, setSearch] = useState('')
  const [resources, setResources] = useState<Resource[]>([])
  const [loading, setLoading] = useState(false)
  const [answer, setAnswer] = useState('')
  function closeModal() {
    setIsOpen(false)
    setSearch('')
    setAnswer('')
    setResources([])
  }

  function openModal() {
    setIsOpen(true)
  }

  useEffect(()=>{
    if(!search){
      setAnswer('')
      setResources([])
    }
  },[search])

  const handleSubmit = async (e:React.FormEvent<HTMLFormElement>)=>{
    e.preventDefault()
    if(!search) return

    try{
      setLoading(true)
      const res = await query({"question": `question: ${search}, make sure to always give resources in a list format with all the detail like NAME DESC and URL, if no resource is available just say 'No resource found', also go through all the resources in the context properly if the resource might be usefull include that also, don't hesitate just give as many resources as possible for the provided question`})
      setAnswer(res)
    }catch(err:any){
      toast.error(err.message || 'Something went wrong')
    }
    finally{
      setLoading(false)
    }
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
            enter="ease-out duration-100"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-50" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex justify-center min-h-full p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-100"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-100"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="md:min-w-[80vw] min-w-[100vw]  h-auto transform bg-none overflow-hidden rounded-2xl md:p-6 p-2 text-left align-middle shadow-xl transition-all">
                  <form onSubmit={handleSubmit} className='relative md:mt-[3rem] md:flex items-center w-full flex-col '>
                    <div className='relative'>
                      <input value={search} onChange={(e)=>{
                        setSearch(e.target.value)
                        if(e.target.value.length<1){
                          setResources([])
                        }
                      }} type="text" className={`md:w-[40vw] w-full h-[60px] shadow-2xl text-white md:rounded-b-[0px] rounded-[10px] border-white bg-[#0d0d0e] border-2 outline-none px-[2rem] pr-[3rem] md:pr-[2rem] md:px-[2rem]`} placeholder={
                        isDesktop ? 'I want to add this to my website...':'Search with AI'
                      }/>
                      <div className='absolute right-[1rem] top-[25%]'>
                        <button  className='text-white'>
                          <PiMagicWandLight className='text-sky-400 h-[2rem] w-[2rem]'/>
                        </button>
                      </div>
                      {/* {isDesktop && <div className="absolute right-4 bottom-[-2.8rem] bg-gray-800 p-2 rounded-md shadow-lg">
                        <kbd className="px-2 py-1 text-white bg-gray-900 border border-gray-700 rounded">
                            esc
                        </kbd> 
                        <span className="ml-2 text-trueGray-200">to close</span>
                    </div>} */}
                      {!isDesktop && <div onClick={closeModal} className="absolute cursor-pointer right-4 bottom-[-2.8rem] bg-gray-800 p-2 rounded-md shadow-lg">
                        <span className="ml-2 text-trueGray-200">Close</span>
                    </div>}
                    </div>

                  </form>
                  {
                    loading && !isDesktop && <div className="w-[100%] mt-[30vh] flex items-center justify-center">
                     <div className='bg-white' id='logo'>
                  <img src='assets/LogoImage.png'/>
                  </div>
                    </div>
                  }
                  {
                    loading  && isDesktop && <div className="w-full flex flex-col items-center">
                      <div className='w-[40vw] flex items-center justify-between h-[4rem] border-white rounded-b-[10px] border p-[1rem] bg-[#0d0d0e]'>
                      <div className='flex w-[50%] h-full items-center'>
                          <p className='text-white truncate text-sm'>Searching...</p>
                      </div>
                        <div className='flex gap-[0.5rem] items-center'>
                          <ImSpinner8 className='text-white animate-spin h-[1.5rem] w-[1.5rem]'/>
                        </div>
                      </div>
                      </div>
                  }
                  {
                    !loading && !answer && isDesktop && <div className="w-full flex flex-col items-center">
                      <div className='w-[40vw] flex items-center justify-between h-[4rem] border-white rounded-b-[10px] border p-[1rem] bg-[#0d0d0e]'>
                      <div className='flex w-[50%] h-full items-center'>
                          <p className='text-white truncate text-sm'>Type something and Press Enter to Search...</p>
                      </div>
                        <div className='flex gap-[0.5rem] items-center'>
                          <MdKeyboardReturn className='text-white h-[1.5rem] w-[1.5rem]'/>
                          </div>
                      </div>
                      </div>
                  }


                  {isDesktop && <div className='w-full flex flex-col items-center'>
                    <div className='border no-scrollbar border-white max-h-[60vh] overflow-y-auto overflow-x-hidden rounded-b-[10px]'>
                      {
                        answer && !loading && search && <div className='w-full flex flex-col items-center'>
                          <div className='w-[40vw] overflow-x-auto no-scrollbar flex items-center justify-between border-white rounded-b-[10px] border p-[1rem] bg-[#0d0d0e]'>
                          
                              <pre className='text-white text-sm'>{answer}</pre>
                          
                          
                          </div>
                          </div>
                      }

                    </div>
                  </div>}

                {!isDesktop && <div className='mt-[3rem] w-full'>
                  {resources.length>=1 && !loading && <Reorder.Group values={resources} axis={'x'} onReorder={()=>{}} className='z-[1] md:ml-[3rem] flex gap-[1rem] flex-wrap mt-[2rem]'>
                    {resources.map((e)=>{
                      return (
                        <Reorder.Item key={e._id} value={e} initial={{ scale:0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}>
                        
                          <MobileResourceCard key={e._id} resource={e} />
                        </Reorder.Item>
                        )
                      })} 
                  </Reorder.Group>}
                  </div>}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
  )
}

export default SearchBarModal