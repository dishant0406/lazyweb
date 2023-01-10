import { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { Resource } from '@/hooks/Zustand';
import {FiExternalLink} from 'react-icons/fi'
import { formatUrl } from '@/lib/formatUrl';

type Props = {
  isOpen: boolean,
  setIsOpen: (argo:boolean)=>void,
  resource: Resource
}

const capitalize = (s:string) => {
  if (typeof s !== 'string') return ''
  return s.charAt(0).toUpperCase() + s.slice(1).toLocaleLowerCase()
}


const InfoModal = ({isOpen, setIsOpen, resource}:Props) => {

  function closeModal() {
    setIsOpen(false)
  }

  function openModal() {
    setIsOpen(true)
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
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="min-w-[28rem] transform overflow-hidden rounded-2xl bg-gray p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg whitespace-nowrap flex items-center gap-[10px] font-medium leading-6 text-white"
                  >
                    {resource.title}
                    <FiExternalLink onClick={()=>window.open(formatUrl(resource.url), '_blank')} className='text-[16px] cursor-pointer text-white'/>
                  </Dialog.Title>
                  <div style={{
                    //background url as image_url and position as center
                    backgroundImage: `url(${resource.image_url})`,
                    backgroundPosition: '50% 50%',
                    backgroundSize: 'cover',

                  }} className="mt-2 h-[12rem] rounded-2xl">
                  </div>
                  <div className='w-[full] flex justify-center'>
                  <div className="mt-2 w-[90%]  flex">
                    <p className="text-[16px] text-start text-white">
                      {resource.desc}
                    </p>
                  </div>
                  </div>
                  <div className="mt-2 w-[90%]">
                    <p className="text-white mb-[5px] mt-[1rem] ml-[1rem]">Category:</p>
                    <span className="text-white rounded-2xl bg-lightGray px-[15px] py-[2px] ml-[1.5rem]">{capitalize(resource.category)}</span>
                    <p className="text-white mt-[0.5rem] ml-[1rem]">Tags:</p>
                    <div className="flex gap-[0.5rem] flex-wrap mt-[5px] ml-[1.5rem]">
                      {resource.tags.map((tag:string)=>(
                        <span className="text-gray bg-white text-[14px] px-[10px] rounded-2xl py-[2px]">{capitalize(tag)}</span>
                      ))}
                    </div>
                  </div>
                  
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
  )
}

export default InfoModal