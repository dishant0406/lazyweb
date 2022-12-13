const logo = '/assets/Logo.png'
import {SearchBar, ProfileIcon, LoginModal} from 'components'
import {Grid} from 'react-feather'
import { useState, useEffect } from 'react';
import { supabaseClient } from 'lib/supabaseClient';
import {User} from '@supabase/gotrue-js/src/lib/types'

type Props = {}

const NavBar = (props: Props) => {
  const [isOpen, setIsOpen] = useState(false)
  const [session, setSession] = useState<User|null>(null)

  useEffect(()=>{
    (
      async ()=>{
        const {data,error} = await supabaseClient.auth.getSession()
        
        if(data.session?.user){
          setSession(data.session.user)
        }
      }
    )()
  },[])

  return (
    <div className="w-[100vw] border-b border-[#5e5f60] flex justify-between items-center h-[70px] bg-[#202124]">
      <div className='flex items-center'>
        <div className="bg-white w-[140px] ml-[20px]">
          <img src={logo} className='h-[45px]' />
        </div>
        <SearchBar/>
      </div>
      <div className='flex gap-[1rem] mr-[1rem] items-center'>
        <div className='h-[2.5rem] w-[2px] bg-[#5e5f60]'/>
        <Grid className='text-[#6c6c6c] cursor-pointer'/>
        <ProfileIcon onClick={()=>!session && setIsOpen(true)} className='mr-[1rem] cursor-pointer' address={(session && session.email) ?session.email:'lazyweb'}/>
      </div>
      <LoginModal isOpen={isOpen} setIsOpen={setIsOpen}/>
    </div>
  )
}

export default NavBar