import { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { useState } from 'react';
import { useWebsiteScreenshot, useWebsiteMetaData } from 'hooks';
import { formatUrl } from 'lib/formatUrl';
import { supabaseClient } from 'lib/supabaseClient';
import { useUserData } from '@/hooks';
let placeholder = 'assets/placeholder-website.png'

type Props = {
  isOpen: boolean,
  setIsOpen: (argo:boolean)=>void
}

const CreateModal = ({isOpen, setIsOpen}:Props) => {
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')
  const [description, setDescription] = useState('')
  const [tags, setTags] = useState('')
  const [image, setImage] = useState(placeholder)
  const [loadingFetch, setLoadingFetch] = useState(false)
  const [err, setError] = useState<String|null>(null)
  const session = useUserData(state=>state.session)

  function closeModal() {
    setIsOpen(false)
    setTimeout(()=>{
      setTitle('')
      setUrl('')
      setDescription('')
      setTags('')
      setImage(placeholder)
      setLoadingFetch(false)
      setError(null)
    }
    ,300)
  }

  function openModal() {
    setIsOpen(true)
  }

  const handleAdd = async () =>{
    //add to supabase
    if(session && image!=='' && title!==''){
      const {data, error} = await supabaseClient.from('website').insert([
        {
          title,
          url,
          created_by:session?.id,
          desc:description,
          image_url:image
        }
      ]).select()
      console.log(data)
      if(error){
        console.log(error)

      }else{
        closeModal()
      }
    }
  }

  const handleFetchDetails = async ()=>{
    setError(null)
    const websiteMetaDeta = await useWebsiteMetaData(formatUrl(url))
    if(websiteMetaDeta){
      setTitle(websiteMetaDeta.title)
      setDescription(websiteMetaDeta.description)
      if(websiteMetaDeta.title){
        const imagelink = await useWebsiteScreenshot(formatUrl(url))
        if(imagelink){
          setImage(imagelink)
        }
      }
    }else{
      setError('Please Check your Url')
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
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-50" />
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
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-gray p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-white"
                  >
                    Add a Resource
                  </Dialog.Title>
                  {err && <div className="mt-2">
                    <p className="text-sm text-red-600 font-[600]">
                      {err}
                    </p>
                  </div>}
                  <div className="mt-2">
                    <p className="text-sm text-white">
                      Enter the URL
                    </p>
                  </div>
                    
                  <input value={url} onChange={(e)=>setUrl(e.target.value)} placeholder='lazyweb.com' className="bg-[#35363a] w-[90%] border-none outline-none text-white h-[2.5rem] mt-[0.5rem] px-[1rem] rounded-[12px]" />

                  <div className="mt-4">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-[#1c64ec] text-white px-4 py-2 text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                      onClick={handleFetchDetails}
                    >
                      Fetch Details
                    </button>                   
                  </div>
                  
                  <div>
                    <div className="mt-4">
                      <p className="text-sm text-white">
                        Title
                      </p>
                    </div>
                      
                    <input value={title} onChange={(e)=>setTitle(e.target.value)} placeholder='LazyWeb' className="bg-[#35363a] w-[90%] border-none outline-none text-white h-[2.5rem] mt-[0.5rem] px-[1rem] rounded-[12px]" />
                  </div>
                  <div className='mb-[-2rem]'>
                    <div className="mt-4">
                      <p className="text-sm text-white">
                        Description
                      </p>
                    </div>
                      
                    <input value={description} onChange={(e)=>setDescription(e.target.value)} placeholder='Resources that you need...' className="bg-[#35363a] w-[90%] border-none outline-none text-white h-[2.5rem] mt-[0.5rem] px-[1rem] rounded-[12px]" />
                  </div>
                  <div className='mt-4 scale-75 mb-[-2rem]'>
                    <img className='h-[280px] rounded-lg w-[480px]' src={image}/>
                  </div>
                  <div className="mt-4">
                    <button
                      type="button"
                      disabled={title=='' && image == placeholder}
                      className="inline-flex justify-center rounded-md border border-transparent bg-[#1c64ec] text-white px-4 py-2 text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                      onClick={handleAdd}
                    >
                      Add
                    </button>                   
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
  )
}

export default CreateModal