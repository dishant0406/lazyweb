import { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'

type Props = {
  isOpen: boolean,
  setIsOpen: (argo:boolean)=>void,
}

const capitalize = (s:string) => {
  if (typeof s !== 'string') return ''
  return s.charAt(0).toUpperCase() + s.slice(1).toLocaleLowerCase()
}


const LoadingModal = ({isOpen, setIsOpen}:Props) => {

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
            leave="ease-in duration-200"
            leaveFrom="scale-100"
            leaveTo="scale-0"
          >
            <div className="fixed inset-0 bg-gray" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                leave="ease-in duration-200"
                leaveFrom="scale-100"
                leaveTo="scale-0"
              >
                <Dialog.Panel className="h-[95vh] w-[100vw] flex justify-center items-center transform overflow-hidden rounded-2xl bg-gray p-6 text-left align-middle shadow-xl transition-all">
                  
                <div className={`h-[90vh] w-[100vw] flex justify-center bg-gray items-center`}>
                  <div className='bg-white' id='logo'>
                  <img src='assets/LogoImage.png'/>
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

export default LoadingModal