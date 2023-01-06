import { Category, Sidebar, Dashboard, Favicon, CommingSoon } from 'components'
import { useEffect} from 'react'
import { useAllResources, useStoreVisitersInfoIfDoesNotExist, useUserData } from '@/hooks/Zustand';
import { useTour } from '@reactour/tour';
import { isDesktop } from 'react-device-detect';
import { motion } from 'framer-motion';


type Props = {}

const Home = (props: Props) => {
  const {setVisitersInfo} = useStoreVisitersInfoIfDoesNotExist()
  const {setIsOpen,setSteps} = useTour()
  const {session} = useUserData()
  const {allResources} = useAllResources()
 

  useEffect(()=>{
    setVisitersInfo()
    //if nosessiontour is available in localstorage then setisOpen to true
    if(!localStorage.getItem('nosessiontour') && isDesktop && !session){
      setIsOpen(true)
    }
  },[])

  useEffect(()=>{
    if(session){
      setSteps([
        {
          selector: '.lazyweb-add',
          content: 'Click here to add a resource',
        },
        {
          selector: '.lazyweb-resource-list',
          content: 'Access Saved resources and resources that you add after siging in',
        },
      ])
      //if sessiontour is available in localstorage then setisOpen to true
      if(!localStorage.getItem('sessiontour') && isDesktop){
      setIsOpen(true)
      }
    }
  },[session])

  return (
    <>
    <Favicon/>
    <div className={`h-[100vh] w-[100vw] flex justify-center ${allResources.length!==0&&'hidden'} bg-gray items-center`}>
          <motion.div className='bg-white' id='logo'>
          <img src='assets/LogoImage.png'/>
          </motion.div>
        </div>
    <div className={`md:flex hidden ${allResources.length===0&&'hidden'}`}>
      <div>
        <Category/>
        <div className={`flex w-[100vw] `}>
          <Sidebar/>
          <Dashboard/>
        </div>
      </div>
    </div>
    <CommingSoon/>
    </>
  )
}

export default Home