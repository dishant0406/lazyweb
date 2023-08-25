type Props = {}
import { useAllResources, useAllCategory, useFilterUsingCategoriesArray, useUserData } from 'hooks/Zustand';
import React, { useState, useRef, useEffect } from 'react';
import { BsFilter } from 'react-icons/bs';
import { MdOutlineSaveAlt } from 'react-icons/md';
import { CreateResource, MobileResourceCard } from 'components';
import { BottomSheet, BottomSheetRef } from 'react-spring-bottom-sheet'
import axios from 'axios';
import {FiLayers} from 'react-icons/fi'
import {RiGlobalLine} from 'react-icons/ri'
import { AuthError, Provider, Session, User} from '@supabase/supabase-js';
import { PuffLoader } from 'react-spinners';
import { Reorder } from 'framer-motion';

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

const SwipeUI = (props: Props) => {
  const {allResources, setAllResources} = useAllResources()
  const [open, setOpen] = useState(false)
  const bottomSheetRef = useRef<BottomSheetRef>(null)
  const {allCategories} = useAllCategory()
  const [selectedCategory, setSelectedCategory] = useState<string[]>([])
  const {setFilteredResources, filteredResources} = useFilterUsingCategoriesArray()
  const [checkedList, setCheckedList] = useState<any>({
  })
  const [loginOpen, setLoginOpen] = useState(false)
  const [imgData, setImgData] = useState('')
  const {session,setSession, signOut} = useUserData()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<AuthError|null>(null)
  const [data, setData] = useState<Data|DataGithub|null>(null)

  useEffect(()=>{
    (
      async ()=>{
        const {data} = await axios.post('/api/identicon',{text:session?.email || 'Login'})
        setImgData(data)
      }
    )()

  },[session?.email])

  const setName = (name:string)=>{
    if(name.length>5){
      return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()
      }else{
        return name.toUpperCase()
      }
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
        // Close the popup
        if (popup) popup.close();
      }
    }, false);
    if(error){
      setError(error)
    }
    setLoading(false)

  }

  function onDismiss() {
    setOpen(false)
    setLoginOpen(false)
    setTimeout(()=>{
      setEmail('')
      setLoading(false)
      setError(null)
      setData(null)
    },300)
  }

  const handleChange = (e:any)=>{
    if(e.target.checked){
      setSelectedCategory([...selectedCategory, e.target.defaultValue])
      setCheckedList((list:any)=>{
        return {...list, [e.target.defaultValue]:true}
      })
    }else{
      setSelectedCategory(selectedCategory.filter((category)=>category!==e.target.defaultValue))
      setCheckedList((list:any)=>{
        return {...list, [e.target.defaultValue]:false}
      }
      )
    }
  }

  const handleProfileClick = async ()=>{
    if(session){
      await signOut()
    }else{
      setLoginOpen(true)
    }
  }

  return (
    <div className='min-h-[100vh] relative w-[100vw] flex-col md:hidden flex bg-gray'>
      <div className='h-[70px] flex items-end w-[100vw] justify-center'>
        <div className='h-fit w-[9rem] bg-white'>
            <img src='assets/Logo.png'/>
        </div>
      </div>
      <div className='w-[100vw] flex gap-[1rem] mt-[1rem] justify-center'>
        <button onClick={session ? ()=>setAllResources('saved') : ()=> setLoginOpen(true)} className='text-white flex items-center justify-center gap-[5px] bg-altGray h-[3rem] rounded-xl w-[8rem]'>
          <MdOutlineSaveAlt className='text-white'/>
          Saved
          </button>
        <button onClick={()=>setOpen(true)} className='text-white flex items-center justify-center gap-[5px] bg-altGray h-[3rem] rounded-xl w-[8rem]'>
          <BsFilter className='text-white'/>
          Filter
          </button>
      </div>

      <Reorder.Group values={filteredResources.length>0?filteredResources:allResources} axis={'x'} onReorder={()=>{}} className='mt-[2rem] mb-[5rem] w-[100vw] gap-[10px] flex justify-center flex-wrap'>
          {
            filteredResources.length===0 && allResources.map((resource, index) => {
              return (
                <Reorder.Item key={resource._id} value={resource} initial={{ scale:0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}>

                <MobileResourceCard
                  key={index}
                  resource={resource}
                  />
                  </Reorder.Item>
              )
            })
          }
          {
            filteredResources.length>0 && filteredResources.map((resource, index) => {
              return (
                <Reorder.Item key={resource._id} value={resource} initial={{ scale:0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}>

                <MobileResourceCard
                  key={index}
                  resource={resource}
                  />
                  </Reorder.Item>
              )
            })
          }
      </Reorder.Group>
      <BottomSheet ref={bottomSheetRef} onDismiss={onDismiss} open={open}>
        <div className='w-[100%] mb-[2rem] mt-[1rem] flex flex-col items-center'>
          <p className='text-[1.5rem] text-lightGray mb-[10px]'>Filter Category</p>
          {
            allCategories.map((category)=>{
              return <div key={category} className='w-[80%] flex justify-between'>
                <div className='text-gray text-[1rem] mb-[10px]'>{setName(category)}</div>
                <input onChange={(e)=>handleChange(e)} checked={checkedList[category]} value={category} type={'checkbox'}/>
              </div>
            })
          }
          
        <button
        className='h-[3rem] w-[80%] text-white bg-altGray rounded-xl'
          onClick={() => {
            setFilteredResources(selectedCategory)
            setOpen(false)
          }}
        >
          Apply
        </button>
        </div>
      </BottomSheet>
      <BottomSheet ref={bottomSheetRef} onDismiss={onDismiss} open={loginOpen}>
        <div className='w-[100%] mb-[2rem] mt-[1rem] flex flex-col items-center'>
          <p className='text-[1.5rem] text-lightGray mb-[10px]'>Login</p>
          {(data && !error) && <div className='w-[90%]'>
            <p className='text-center text-gray mb-[1rem]'>Check your Email (and spam folder) for a login link</p>
          </div>}
          {error && <div className='w-[90%]'>
            <p className='text-center text-red-700 font-[600] mb-[1rem]'>{error.message}</p>
          </div>}
          {(!data || error) && <input value={email} onChange={(e)=>setEmail(e.target.value)} placeholder='example@lazyweb.rocks' className='w-[90%] rounded-xl px-[1rem] h-[60px] border border-opacity-60 mb-[10px] border-gray'/>}
          <button
            className='h-[3rem] w-[80%] flex items-center justify-center text-white bg-altGray rounded-xl'
              onClick={() => {
                handleLogin()
              }}
              disabled={(!data||error)?false:true}
            >
            {!data || error ? (!loading ? 'Sign In': <PuffLoader size={20} color="#fff" />):'Email Sent'}
          </button>
          <button
            className='h-[3rem] mt-[10px] w-[80%] text-white bg-altGray rounded-xl'
              onClick={() => {
                handleGithubLogin()
              }}
              disabled={(!data||error)?false:true}
            >
            Github
          </button>
        </div>
      </BottomSheet>
      <div className='h-[70px] border-t border-lightGray flex justify-center bg-altGray fixed bottom-[-2px] w-[100vw]'>
        <div className='w-[90%] justify-around flex items-center h-[70px]'>
          <div onClick={()=>setAllResources('all')} className='flex flex-col items-center'>
            <RiGlobalLine className='text-[#6c6c6c] text-[22px] lazyweb-add transition-all cursor-pointer'/>
            <span className='text-[#6c6c6c] mt-[3px] md:hidden flex text-[12px]'>All</span>
          </div>
          <div onClick={()=>!session && setLoginOpen(true)}>
            <CreateResource/>
          </div>
          <div onClick={session ? ()=>setAllResources('my') : ()=> setLoginOpen(true) } className='flex flex-col items-center'>
            <FiLayers className='text-[#6c6c6c] text-[22px] lazyweb-add transition-all cursor-pointer'/>
            <span className='text-[#6c6c6c] mt-[3px] md:hidden flex text-[12px]'>My</span>
          </div>
          <img onClick={handleProfileClick} className='h-[40px] rounded-full' src={imgData}/>  
        </div>
      </div>
    </div>
  )
}

export default SwipeUI