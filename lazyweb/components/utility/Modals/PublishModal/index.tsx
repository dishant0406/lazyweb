import { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { useState } from 'react';
import { useWebsiteScreenshot, useWebsiteMetaData } from 'hooks';
import { formatUrl } from 'lib/formatUrl';
import { supabaseClient } from 'lib/supabaseClient';
import { useUserData } from '@/hooks';
import { unFormatUrl } from '@/lib/unFormatUrl';
import CreatableSelect from 'react-select/creatable'
let placeholder = 'assets/placeholder-website.png'
import { MultiValue } from 'react-select';
import { useCompleteResourceLength, useAllResources, useAllTags,useAllCategory } from 'hooks/Zustand';

type Props = {
  isOpen: boolean,
  setIsOpen: (argo:boolean)=>void,
  url:string,
  title:string,
  id:number
}

type MultiValueProps = MultiValue<{
  value: string;
  label: string;
}>

const PublishModal = ({isOpen, setIsOpen, url ,title,id}:Props) => {
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [tags, setTags] = useState<String[]>([])
  const [image, setImage] = useState(placeholder)
  const [loadingFetch, setLoadingFetch] = useState(false)
  const [err, setError] = useState<String|null>(null)
  const session = useUserData(state=>state.session)
  const {completeResourceLength} = useCompleteResourceLength()
  const {setAllResources} = useAllResources()
  const {setAllTags} = useAllTags()
  const {setAllCategories,allCategories} = useAllCategory()

  function closeModal() {
    setIsOpen(false)
    setTimeout(()=>{
      setDescription('')
      setTags([])
      setImage(placeholder)
      setLoadingFetch(false)
      setError(null)
    }
    ,300)
  }

  function openModal() {
    setIsOpen(true)
  }

  const options = allCategories.map((e)=>{
    return {value:e, label:e}
  })
  
  const optionsTags = [

   { value:'new',label:'new'},
   { value:'retro',label:'retro'},
   { value:'all time favourite',label:'all time favourite'},
   { value:'great help',label:'great help'},
   { value:'must use',label:'must use'},
  ]
  
  

  const handleTags = (e:MultiValueProps)=>{
    let tagsArr:string[] = []
    e.map((f)=>{
      tagsArr.push(f.value.toLowerCase())
    })
    setTags(tagsArr)
  }

  const handleAdd = async () =>{
    //check if category and tags are not empty if not then update tags and category in supabase and set isAvailableForApproval to true
    if(category && tags?.length>0){
      setLoadingFetch(true)
      setError('')
      const {data, error} = await supabaseClient
      .from('website')
      .update({category:category.toLowerCase(), tags:tags, isAvailableForApproval:true})
      .match({id:id})
      if(error){
        setError(error.message)
      }else{
        setAllResources('my')
        setAllTags()
        setAllCategories()
        closeModal()
      }
      setLoadingFetch(false)
    }else{
      setError('Enter Valid Data for Submitting for Public View')
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
                <Dialog.Panel className="w-full max-w-md transform rounded-2xl bg-gray p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-white"
                  >
                    Publish a Resource
                  </Dialog.Title>
                  {err && <div className="mt-2">
                    <p className="text-sm text-red-600 font-[600]">
                      {err}
                    </p>
                  </div>}
                  <div className="mt-2">
                    <p className="text-sm text-white">
                      URL
                    </p>
                  </div>
                    
                  <input disabled value={url} placeholder='lazyweb.com' className="bg-[#35363a] cursor-not-allowed opacity-[0.5] w-[90%] border-none outline-none text-white h-[2.5rem] mt-[0.5rem] px-[1rem] rounded-[12px]" />

                  
                  <div>
                    <div className="mt-4">
                      <p className="text-sm text-white">
                        Title
                      </p>
                    </div>
                      
                    <input disabled value={title} placeholder='LazyWeb' className="bg-[#35363a] cursor-not-allowed opacity-[0.5] w-[90%] border-none outline-none text-white h-[2.5rem] mt-[0.5rem] px-[1rem] rounded-[12px]" />
                  </div>
                  <div className=''>
                    <div className="mt-4">
                      <p className="text-sm text-white">
                        Category
                      </p>
                    </div>
                      
                    <CreatableSelect styles={{
                        control: (baseStyles, state) => ({
                          ...baseStyles,
                          backgroundColor:'#35363a',
                          border:'none',
                          width:'90%',
                          borderRadius:'12px',
                          marginTop:'0.5rem',
                          color:'#fff !important'
                        }),
                       input:(base, props)=>( {
                        ...base,
                        color:'#fff !important'
                       }),
                       menuList:(base, props)=> ({
                        ...base,
                        height:'200px',
                       }),
                       
                      }} onChange={e=>e?setCategory(e?.value):setCategory('')} isClearable options={options} />
                  </div>
                  <div className='mb-[-2rem]'>
                    <div className="mt-4">
                      <p className="text-sm text-white">
                        Tags
                      </p>
                    </div>
                      
                    <CreatableSelect isMulti styles={{
                        control: (baseStyles, state) => ({
                          ...baseStyles,
                          backgroundColor:'#35363a',
                          border:'none',
                          width:'90%',
                          borderRadius:'12px',
                          marginTop:'0.5rem',
                          color:'#fff !important',
                        }),
                        input:(base, props)=>( {
                          ...base,
                          color:'#fff !important'
                         }),
                         menuList:(base, props)=> ({
                          ...base,
                          maxHeight:'200px',
                         }),

                      }} onChange={e=>handleTags(e)} isClearable options={optionsTags} />
                  </div>
                  
                  <div className="mt-[3rem]">
                    <button
                      type="button"
                      disabled={title=='' && image == placeholder && loadingFetch}
                      className="inline-flex justify-center rounded-md border border-transparent bg-[#1c64ec] text-white px-4 py-2 text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                      onClick={handleAdd}
                    >
                     { loadingFetch?'Loading...':'Submit for Publishing'}
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

export default PublishModal