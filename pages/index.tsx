import { Category, Sidebar, Dashboard, Favicon, CommingSoon, LoadingModal } from 'components'
import { useEffect, useState} from 'react'
import { useAllResources, useSelectedTab, useStoreVisitersInfoIfDoesNotExist, useUserData } from '@/hooks/Zustand';
import { useTour } from '@reactour/tour';
import { isDesktop } from 'react-device-detect';


type Props = {}

const Home = (props: Props) => {
  const {setVisitersInfo} = useStoreVisitersInfoIfDoesNotExist()
  const {setIsOpen,setSteps} = useTour()
  const {session} = useUserData()
  const {allResources} = useAllResources()
  const {selectedTab} = useSelectedTab()
  const [isLoadingModalOpen, setisLoadingModalOpen] = useState(true)
 

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

  useEffect(()=>{
    if(allResources.length > 0){
      setisLoadingModalOpen(false)
    }
  },[allResources])

  return (
    <>
    <Favicon/>
    <div className={`md:flex hidden`}>
      <div>
        <Category/>
        <div className={`flex w-[100vw] `}>
          <Sidebar/>
          <Dashboard/>
        </div>
      </div>
    </div>
    <CommingSoon/>
    <LoadingModal isOpen={isLoadingModalOpen} setIsOpen={setisLoadingModalOpen}/>
    </>
  )
}

export default Home