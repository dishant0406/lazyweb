import { Category, Sidebar, Dashboard, Favicon, CommingSoon } from 'components'
import { useEffect} from 'react'
import { useStoreVisitersInfoIfDoesNotExist, useUserData } from '@/hooks/Zustand';
import { useTour } from '@reactour/tour';
import { isDesktop } from 'react-device-detect';


type Props = {}

const Home = (props: Props) => {
  const {setVisitersInfo} = useStoreVisitersInfoIfDoesNotExist()
  const {setIsOpen,setSteps} = useTour()
  const {session} = useUserData()
 

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
    <div className='md:flex hidden'>
      <div>
        <Category/>
        <div className='flex w-[100vw]'>
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