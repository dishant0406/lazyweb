import { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { Resource } from '@/hooks/Zustand';
import {FiExternalLink} from 'react-icons/fi'
import { formatUrl } from '@/lib/formatUrl';
import { useRouter } from 'next/router';
import * as ShareSocialType from 'react-share-social';
import Head from 'next/head';
const {ShareSocial} = ShareSocialType as any;



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
  const router = useRouter()

  const closeModal = () => {
    const { query } = router;
    delete query.id;

    router.replace({
      pathname: router.pathname,
      query: query,
    }, undefined, { shallow: true });
  };

  function openModal() {
    setIsOpen(true)
  }


  return (
    <>
   {isOpen && (
  <Head>
    <title>{resource.title ? ''+ resource.title : 'Lazyweb'}</title>
    <meta name="description" content={resource.desc ? resource.desc : 'Lazyweb Rocks'} />

    {/* Basic Open Graph Tags */}
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="Lazyweb" />
    <meta property="og:title" content={resource.title ? ''+ resource.title : 'Lazyweb'} />
    <meta property="og:description" content={resource.desc ? resource.desc : 'Lazyweb Rocks'} />
    <meta property="og:image" content={resource.image_url ? resource.image_url : 'Default Image URL'} />
    
    {/* Additional Open Graph Tags */}
    <meta property="og:url" content={typeof window !== 'undefined' ? window.location.href : ''} />
    <meta property="og:locale" content="en_US" />

    {/* Twitter-specific meta tags */}
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content={resource.title ? ''+ resource.title : 'Lazyweb'} />
    <meta name="twitter:description" content={resource.desc ? resource.desc : 'Lazyweb Rocks'} />
    <meta name="twitter:image" content={resource.image_url ? resource.image_url : 'Default Image URL'} />
  </Head>
)}

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
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="md:min-w-[28rem] transform overflow-hidden rounded-2xl bg-gray p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg md:whitespace-nowrap flex items-center gap-[10px] font-medium leading-6 text-white"
                  >
                    <div className='w-[16px]'>
                      <FiExternalLink onClick={()=>window.open(formatUrl(resource.url), '_blank')} className='text-[16px] hover:scale-[1.2] transition-all cursor-pointer text-white'/>
                    </div>
                    {
                      //resouce title is too long then break it into half
                      resource.title.length > 100 ?
                      <div className=' flex-col mb-[10px]'>
                        <span className='hidden md:flex'>{resource.title.slice(0, 100)}</span>
                        <span className='hidden md:flex'>{resource.title.slice(100)}</span>
                        <span className='flex md:hidden'>{resource.title.split('|')[0]}</span>
                      </div>
                      :
                      <span>{resource.title}</span>

                    }
                  </Dialog.Title>
                  <div style={{
                    //background url as image_url and position as center
                    backgroundImage: `url(${resource.image_url})`,
                    backgroundPosition: '50% 50%',
                    backgroundSize: 'cover',

                  }} className="mt-2 h-[12rem] rounded-2xl">
                  </div>
                  <div className='w-[full] flex justify-center'>
                  <div className="mt-2 w-[49rem]  flex">
                    <p className="text-[16px] text-start text-white">
                      {resource.desc}
                    </p>
                  </div>
                  </div>
                  <div className="mt-2 w-[90%]">
                    <p className="text-white mb-[5px] mt-[1rem] ml-[1rem]">Category:</p>
                    <span className="text-white rounded-2xl bg-lightGray px-[15px] py-[2px] ml-[1.5rem]">{resource.category && capitalize(resource.category)}</span>
                    <p className="text-white mt-[0.5rem] ml-[1rem]">Tags:</p>
                    <div className="flex gap-[0.5rem] flex-wrap mt-[5px] ml-[1.5rem]">
                      {resource.tags && resource.tags.map((tag:string)=>(
                        <span className="text-gray bg-white text-[14px] px-[10px] rounded-2xl py-[2px]">{capitalize(tag)}</span>
                      ))}
                    </div>
                  </div>
                  <div className='flex mt-[1rem] justify-center w-full'>
                  <ShareSocial
                      url={typeof window !== 'undefined' && window.location.href}
                      style={{
                        root: {
                          width: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          alignItems: 'center',
                          background: 'transparent', // subtle background color
                          borderRadius: '12px', // rounded edges
                          padding: '0',
                          boxShadow: '0 4px 12px 0 rgba(0, 0, 0, 0.05)', // subtle shadow
                          marginTop:'-1.5rem',
                          fontFamily:'poppins'
                        },
                        copyContainer: {
                          background: '#ffffff', // white background
                          padding: '0.5rem 1rem',
                          borderRadius: '8px', // rounded edges for copy container
                          marginBottom: '1rem',
                          boxShadow: '0 2px 6px 0 rgba(0, 0, 0, 0.05)', // subtle shadow
                          fontFamily:'poppins'
                        },
                        
                      }}
                      onSocialButtonClicked={ ()=>{}}   
                      socialTypes={['facebook', 'twitter', 'reddit', 'linkedin', 'email', 'whatsapp']}
                    />

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

export default InfoModal