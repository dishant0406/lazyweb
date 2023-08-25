import { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { useState } from 'react';
import { AuthError, Provider, Session, User} from '@supabase/supabase-js';
import { PuffLoader } from 'react-spinners';
import {GitHub} from 'react-feather'
import axios from 'axios';
import { useUserData } from '@/hooks';

type Props = {
  isOpen: boolean,
  setIsOpen: (argo:boolean)=>void
}

type Data = {
  user: User | null;
  session: Session | null;
} | {
  user: null;
  session: null;
}

type DataGithub = {
  provider: Provider;
  url: string;
} | {
  provider: Provider;
  url: null;
}

const LoginModal = ({isOpen, setIsOpen}:Props) => {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<AuthError|null>(null)
  const [data, setData] = useState<Data|DataGithub|null>(null)
  const {setSession} = useUserData()

  function closeModal() {
    setIsOpen(false)
    setTimeout(()=>{
      setEmail('')
      setLoading(false)
      setError(null)
      setData(null)
    },300)
  }

  function openModal() {
    setIsOpen(true)
  }

  const handleLogin = async ()=>{
    setLoading(true)
    setData(null)
    setError(null)
    // const {data, error} = await supabaseClient.auth.signInWithOtp({
    //   email,
    // })
    await axios.post(`${process.env.NEXT_PUBLIC_LAZYWEB_BACKEND_URL}/api/auth/login`,{
      email
    })
    setData(data)


    if(error){
      setError(error)
    }
    setLoading(false)
  }

  const handleGithubLogin = async ()=>{
    setLoading(true)
    setData(null)
    setError(null)
    // const {data, error} = await supabaseClient.auth.signInWithOAuth({
    //   provider: 'github',
    // })
    // setData(data)
    var width = 500;
    var height = 600;
    var left = (window.innerWidth) / 2;
    var top = (window.innerHeight - height) / 2;
    var url = `${process.env.NEXT_PUBLIC_LAZYWEB_BACKEND_URL}/oauth/github`;
    var options = 
      'scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no,' +
      'width=' + width + ',height=' + height + ',top=' + top + ',left=' + left;

    var popup = window.open(url, 'Github', options);

    window.addEventListener('message', (event) => {
      // if (event.origin !== window.location.origin) return;
      if (event.data.jwt) {
        // Handle your token here
        const {jwt} = event.data
        localStorage.setItem('token', jwt)
        setSession()
        setIsOpen(false)
        // Close the popup
        if (popup) popup.close();
      }
    }, false);
    if(error){
      setError(error)
    }
    setLoading(false)

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
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md p-6 overflow-hidden text-left align-middle transition-all transform shadow-xl rounded-2xl bg-gray">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-white"
                  >
                    Login
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-white">
                      {!data ? 'Enter Your Email':'Check your Email (and spam folder) for a login link'}
                    </p>
                  </div>
                    
                  {(!data || error) && <input onChange={(e)=>setEmail(e.target.value)} value={email} placeholder='joe@lazyweb.rocks' className="bg-[#35363a] w-[90%] border-none outline-none text-white h-[2.5rem] mt-[0.5rem] px-[1rem] rounded-[12px]" />}

                  <div className="mt-4 flex gap-[1rem] items-center">
                    <button
                      onClick={handleLogin}
                      type="button"
                      disabled={(!data||error)?false:true}
                      className="inline-flex min-w-[6rem] justify-center rounded-md border border-transparent bg-[#1c64ec] text-white px-4 py-2 text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                    >
                      {!data || error ? (!loading ? 'Sign In': <PuffLoader size={20} color="#fff" />):'Email Sent'}
                    </button>
                    <p className='text-white'>or</p>
                    <button onClick={handleGithubLogin} className='w-[7rem] py-1 text-lightGray rounded-lg px-[0.5rem] flex justify-center items-center gap-[0.5rem] bg-altGray'>
                      <GitHub className='text-lightGray h-[2rem]'/>
                      Github
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

export default LoginModal