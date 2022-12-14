import { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { useState } from 'react';
import { supabaseClient } from 'lib/supabaseClient';
import { AuthError, Session, User} from '@supabase/supabase-js';
import { PuffLoader } from 'react-spinners';

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

const LoginModal = ({isOpen, setIsOpen}:Props) => {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<AuthError|null>(null)
  const [data, setData] = useState<Data|null>(null)

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
    const {data, error} = await supabaseClient.auth.signInWithOtp({
      email,
    })
    setData(data)
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
                    Login
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-white">
                      {!data ? 'Enter Your Email':'Check Your Email'}
                    </p>
                  </div>
                    
                  {(!data || error) && <input onChange={(e)=>setEmail(e.target.value)} value={email} placeholder='joe@lazyweb.com' className="bg-[#35363a] w-[90%] border-none outline-none text-white h-[2.5rem] mt-[0.5rem] px-[1rem] rounded-[12px]" />}

                  <div className="mt-4">
                    <button
                      onClick={handleLogin}
                      type="button"
                      disabled={(!data||error)?false:true}
                      className="inline-flex min-w-[6rem] justify-center rounded-md border border-transparent bg-[#1c64ec] text-white px-4 py-2 text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                    >
                      {!data || error ? (!loading ? 'Sign In': <PuffLoader size={20} color="#fff" />):'Email Sent'}
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