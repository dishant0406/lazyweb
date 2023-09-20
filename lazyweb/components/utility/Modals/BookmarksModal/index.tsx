import { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { Resource, axiosInstance, useUserData } from '@/hooks/Zustand';
import ResourceCard from '@/components/desktop/ResourceCard';
import { useRouter } from 'next/router';
import MobileResourceCard from '@/components/mobile/MobileResourceCard';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { event } from 'nextjs-google-analytics';



type Props = {
  isOpen: boolean,
  setIsOpen: (argo: boolean) => void,
  resources: Resource[] | undefined
}

const capitalize = (s: string) => {
  if (typeof s !== 'string') return ''
  return s.charAt(0).toUpperCase() + s.slice(1).toLocaleLowerCase()
}


const BookmarkModal = ({ isOpen, setIsOpen, resources }: Props) => {
  const router = useRouter()
  const {session} = useUserData()
  const [loading, setLoading] = useState(false)

  const closeModal = () => {
    const { query } = router;
    delete query.bookmark;

    router.replace({
      pathname: router.pathname,
      query: query,
    }, undefined, { shallow: true });
  };

  function openModal() {
    setIsOpen(true)
  }

  const bookmarkAll = async ()=>{
    setLoading(true)
    try{
      const {data} = await axiosInstance.post('/websites/bulk-bookmark', {
        resourceIds: resources?.map(e=>e._id)
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })

      if(data.success){
        toast.success('Bookmarked all resources!')
        closeModal()
        setLoading(false)
      }
    }catch(err){
      toast.error('Something went wrong!')
      setLoading(false)
    }
  }


  return (
    <>

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
            <div className="flex items-center justify-center min-h-full p-2 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="md:w-[65vw] w-full transform overflow-hidden rounded-2xl bg-gray md:p-6 p-2 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg px-6 mt-[0.5rem] md:whitespace-nowrap flex w-full justify-center md:justify-between md:pr-[2rem] items-center gap-[10px] font-medium leading-6 text-white"
                  >
                    Shared Resource
                   {session?.id &&  <button
                      type="button"
                      disabled={loading}
                      className="md:inline-flex hidden justify-center px-4 py-1 text-base font-medium bg-[#0d0d0e] border-altGray border-[2px]  rounded-md shadow-sm text-white hover:bg-gray-50 focus:outline-none focus:ring-0 focus:ring-offset-0 "
                      onClick={() => {
                        event('save-all', {
                          category: 'bookmark',
                          action: 'save-all',
                          label: 'save-all'
                        })
                        bookmarkAll()
                      }}
                    >
                      {
                        loading ? 'Saving...' : 'Save All'
                      }
                    </button>}
                  </Dialog.Title>

                  <div className="flex mt-[1rem] justify-between px-[2rem] items-center w-full md:hidden">
                  { <button
                      type="button"
                      disabled={loading}
                      className="inline-flex md:hidden justify-center px-4 py-1 text-base font-medium bg-[#0d0d0e] border-altGray border-[2px]  rounded-md shadow-sm text-white hover:bg-gray-50 focus:outline-none focus:ring-0 focus:ring-offset-0 "
                      onClick={() => {
                        event('save-all', {
                          category: 'bookmark',
                          action: 'save-all',
                          label: 'save-all'
                        })
                        session?.id && bookmarkAll()
                      }}
                    >
                      {
                        session?.id && (loading ? 'Saving...' : 'Save All')
                      }
                      {
                        !session?.id && `${resources?.length} Resources`
                      }
                    </button>}
                    <button
                      type="button"
                      disabled={loading}
                      className="inline-flex md:hidden justify-center px-4 py-1 text-base font-medium bg-[#0d0d0e] border-altGray border-[2px]  rounded-md shadow-sm text-white hover:bg-gray-50 focus:outline-none focus:ring-0 focus:ring-offset-0 "
                      onClick={() => {
                        event('close-modal', {
                          category: 'bookmark',
                          action: 'close-modal',
                          label: 'close-modal'
                        })
                        closeModal()
                      }}
                      >
                      Close
                    </button>
                  </div>

                  <div className="mt-4 md:flex hidden flex-wrap gap-[10px]">
                    {resources && resources.map((e) => {
                      return (
                        <ResourceCard key={e._id} resource={e} description={e.desc} title={e.title} image={e.image_url} url={e.url} />
                      )
                    })}
                  </div>

                  <div className="flex flex-wrap justify-center mt-4 md:hidden ">
                    {resources && resources.map((e) => {
                      return (
                        <div className='scale-90' key={e._id}>
                        <MobileResourceCard key={e._id} resource={e}  />
                        </div>
                      )
                    })}
                  </div>

                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}

export default BookmarkModal