import { Category, Sidebar, Dashboard, Favicon, CommingSoon, LoadingModal, SwipeUI, SEO } from 'components'
import { useEffect, useState} from 'react'
import { useAllResources, useSelectedTab, useUserData } from '@/hooks/Zustand';
import { useTour } from '@reactour/tour';
import { isDesktop } from 'react-device-detect';
import { addDataToMongo } from '../hooks/addDataToMongo';
import { useRouter } from 'next/router';


type Props = {}


const Home = (props: Props) => {
  const {setIsOpen,setSteps} = useTour()
  const {session} = useUserData()
  const {query} = useRouter()
  const {allResources} = useAllResources()
  const {selectedTab} = useSelectedTab()
  const [isLoadingModalOpen, setisLoadingModalOpen] = useState(true)
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
    //token is available in url
    console.log(query)
    if(query.token){
      //add token to localstorage
      localStorage.setItem('token',query.token as string)
      //remove token from url
      window.history.replaceState({}, document.title, "/");

      window.location.reload()
    }
    

    setisLoadingModalOpen(false)
    if(allResources.length > 0){
    }
  },[])

  return (
    <>
    <SEO title='Lazyweb App'/>
    <div className={`md:flex hidden`}>
      <div>
        <Category/>
        <div className={`flex w-[100vw] `}>
          <Sidebar/>
          <Dashboard/>
        </div>
      </div>
    </div>
    <SwipeUI/>
    <LoadingModal isOpen={isLoadingModalOpen} setIsOpen={setisLoadingModalOpen}/>
    </>
  )
}

export default Home