const logo = '/assets/Logo.png'
import {SearchBar, ProfileIcon, LoginModal, CreateResource} from 'components'
import {Grid} from 'react-feather'
import { useState, useEffect } from 'react';
import { supabaseClient } from 'lib/supabaseClient';
import {User} from '@supabase/gotrue-js/src/lib/types'
import { useUserData } from '@/hooks';
import { useTour } from '@reactour/tour';

type Props = {}

const NavBar = (props: Props) => {
  const [isOpen, setIsOpen] = useState(false)
  const {session,setSession, signOut} = useUserData()
  const {setIsOpen:setTourOpen} = useTour()

  useEffect(()=>{
    setSession()
  },[])

  const signoutHandler = async ()=>{
   await supabaseClient.auth.signOut()
   signOut()
  }

  return (
    <div className="w-[100vw] z-[2] fixed border-b border-[#5e5f60] md:flex hidden justify-between items-center h-[70px] bg-[#202124]">
      <div className='flex items-center'>
        <div className="bg-white lazyweb-logo w-[140px] ml-[20px]">
          <img src={logo} className='h-[45px]' />
        </div>
        {/* <SearchBar/> */}
      </div>
      <div className='flex gap-[1rem] mr-[2rem] items-center'>
        <div className='h-[2.5rem] md:flex hidden w-[2px] bg-[#5e5f60]'/>
        {!session && <Grid className='text-[#6c6c6c] md:flex hidden cursor-pointer'/>}
        {session && <CreateResource/>}
        <ProfileIcon onClick={()=>!session && setIsOpen(true)} className='md:flex lazyweb-login hidden cursor-pointer' address={(session && session.email) ?session.email:'lazyweb'}/>
        {session && <button onClick={signoutHandler} className='bg-altGray text-white whitespace-nowrap px-[1rem] rounded-[20px] py-[0.5rem]'>sign out</button>}
      </div>
      <LoginModal isOpen={isOpen} setIsOpen={setIsOpen}/>
    </div>
  )
}

export default NavBar