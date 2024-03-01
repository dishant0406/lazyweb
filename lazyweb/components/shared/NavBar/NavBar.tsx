const logo = '/assets/Logo.png'
import {SearchBar, ProfileIcon, LoginModal, CreateResource} from 'components'
import {Grid} from 'react-feather'
import { useState, useEffect } from 'react';
import { Menu, Transition } from '@headlessui/react'
import { useUserData } from '@/hooks';
import { useTour } from '@reactour/tour';
import { useLoginModal } from '@/hooks/Zustand';
import { Fragment } from 'react';
import { useRouter } from 'next/router';
import { event } from 'nextjs-google-analytics';
import ReactTooltip from 'react-tooltip';

type Props = {}

const IconWithToolTip = ({img, title, path}:{
  img:string
  title:string
  path:string
})=>{
  const router = useRouter()
  return (
    <>
      <a data-tip data-for={title.toLocaleLowerCase().replaceAll(' ', '-')}>
        <img onClick={()=>{
          router.push(path)
        }} src={img} className='h-[1.5rem] cursor-pointer'/>
      </a>
      <ReactTooltip className='bg-gray' type='warning' id={title.toLocaleLowerCase().replaceAll(' ', '-')} place='bottom'>
        {title}
      </ReactTooltip>
    </>
  )
}

const NavBar = (props: Props) => {
  // const [isOpen, setIsOpen] = useState(false)
  const {isLoginModalOpen:isOpen, setIsLoginModalOpen:setIsOpen} = useLoginModal()
  const {session,setSession, signOut} = useUserData()
  const router = useRouter()

  useEffect(()=>{
    setSession()
  },[])

  const signoutHandler = async ()=>{
   signOut()
  }

  return (
    <div className="w-[100vw] z-[4] fixed border-b border-[#5e5f60] md:flex hidden justify-between items-center h-[70px] bg-[#202124]">
      <div className='flex items-center'>
        <div title={
          'Go to home page'
        } onClick={()=>{
          event('go-home', {
            category: 'home',
            action: 'go-home',
            label: 'home'
          })
          router.push('/')
        }} className="bg-white cursor-pointer lazyweb-logo w-[140px] ml-[20px]">
          <img src={logo} className='h-[45px]' />
        </div>
        {/* <SearchBar/> */}
      </div>
      <div className='flex gap-[1rem] mr-[2rem] items-center'>
        <div className='h-[2.5rem] md:flex hidden w-[2px] bg-[#5e5f60]'/>
        <IconWithToolTip img='/assets/playfavicon.ico' path='/playground' title='JS Playground'/>
        <IconWithToolTip img='/assets/snipfavicon.ico' path='/snipshots' title='SnipShots'/>
        <IconWithToolTip img='/assets/notesfav.ico' path='/notes' title='LazyNotes'/>

        {/* <Menu as="div" className="relative inline-block text-left">
          <Menu.Button title={
            'Amazing Tools'
          }>
            <Grid className='text-[#6c6c6c] mt-[0.5rem] md:flex hidden cursor-pointer'/>
          </Menu.Button>
          <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute right-0 w-56 mt-2 border-[3px] border-altGray text-white origin-top-right divide-y divide-gray-100 rounded-md shadow-lg bg-gray ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="px-1 py-1 ">
              <Menu.Item>
                {({ active }) => (
                  <>
                  <button
                  onClick={()=>{
                    event('go-to-playground', {
                      category: 'playground',
                      action: 'go-to-playground',
                      label: 'playground'
                    })
                    router.push('/playground')
                  }}
                    className={`${
                      active ? 'bg-altGray text-white' : 'text-white bg-gray'
                    } group flex w-full transition-all duration-300 items-center rounded-md px-2 py-2 text-sm`}
                  >
                    <img src='/assets/playfavicon.ico' className='h-[1.5rem] mr-[0.5rem]'/>
                    JS Playground
                  </button>
                  <button
                  onClick={()=>{
                    event('go-to-snippet', {
                      category: 'snippet',
                      action: 'go-to-snippet',
                      label: 'snippet'
                    })
                    router.push('/snippet')
                  }}
                    className={`${
                      active ? 'bg-altGray text-white' : 'text-white bg-gray'
                    } group flex w-full transition-all duration-300 items-center rounded-md px-2 py-2 text-sm`}
                  >
                    <img src='/assets/snipfavicon.ico' className='h-[1.5rem] mr-[0.5rem]'/>
                    SnipShots
                  </button>
                  <button
                  onClick={()=>{
                    event('go-to-notes', {
                      category: 'notes',
                      action: 'go-to-notes',
                      label: 'notes'
                    })
                    router.push('/notes')
                  }}
                    className={`${
                      active ? 'bg-altGray text-white' : 'text-white bg-gray'
                    } group flex w-full transition-all duration-300 items-center rounded-md px-2 py-2 text-sm`}
                  >
                    <img src='/assets/notesfav.ico' className='h-[1.5rem] mr-[0.5rem]'/>
                    LazyNotes
                  </button>
                  </>
                )}
              </Menu.Item>
            </div>
            
          </Menu.Items>
        </Transition>
        </Menu> */}
        {session && <CreateResource/>}
        <ProfileIcon onClick={()=>{
          event('open-login-modal', {
            category: 'login',
            action: 'open-login-modal',
            label: 'login'
          })
          //!session && setIsOpen(true)
          if(!session){
            setIsOpen(true)
          }
        }} className='hidden cursor-pointer md:flex lazyweb-login' address={(session && session.email) ?session.email:'Login'}/>
        {session && <button onClick={()=>{
          event('sign-out', {
            category: 'sign-out',
            action: 'sign-out',
            label: 'sign-out'
          })
          signoutHandler()
        }} className='bg-altGray text-white whitespace-nowrap px-[1rem] rounded-[20px] py-[0.5rem]'>sign out</button>}
      </div>
      <LoginModal isOpen={isOpen} setIsOpen={setIsOpen}/>
    </div>
  )
}

export default NavBar