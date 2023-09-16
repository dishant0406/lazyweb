import { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import QRCode from 'react-qr-code'

type Props = {
  isOpen: boolean,
  setIsOpen: (argo:boolean)=>void,
  url?: string
}

const capitalize = (s:string) => {
  if (typeof s !== 'string') return ''
  return s.charAt(0).toUpperCase() + s.slice(1).toLocaleLowerCase()
}


const QrCodeModal = ({isOpen, setIsOpen, url}:Props) => {

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
            <div className="flex items-center justify-center min-h-full p-4 text-center">
              <Transition.Child
                as={Fragment}
                leave="ease-in duration-200"
                leaveFrom="scale-100"
                leaveTo="scale-0"
              >
                <Dialog.Panel className="flex flex-col items-center justify-center p-6 overflow-hidden text-left align-middle transition-all transform shadow-xl rounded-2xl">
                <div className='bg-gray px-[1rem] py-[0.5rem] rounded-md mb-[1rem]'>
                  <p className='text-white text-[14px]'>{url}</p>
                </div>
                <div className={`p-[2rem] bg-gray rounded-md flex justify-center  items-center`}>
                  <div className='bg-white'>
                  <QRCode fgColor='#fff' bgColor='#202124'  value={url || ''} />
                  </div>
                </div>

                <div className='bg-gray px-[1rem] py-[0.5rem] rounded-md mt-[1rem]'>
                  <p className='text-white text-[14px]'>Scan QR Code to open in your mobile</p>
                </div>
                  
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
  )
}

export default QrCodeModal