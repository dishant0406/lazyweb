import { Category, Sidebar, Dashboard, Favicon, CommingSoon, LoadingModal, SwipeUI, SEO, SearchBarModal, BookmarkModal, NavBar } from 'components'
import { useEffect, useState } from 'react'
import { useAllResources,useSetAllResourcesServerSide, useSearchModal, useSelectedTab, useUserData, Resource } from '@/hooks/Zustand';
import { useTour } from '@reactour/tour';
import { isDesktop } from 'react-device-detect';
import { addDataToMongo } from '../hooks/addDataToMongo';
import { useRouter } from 'next/router';
import { Book } from 'react-feather';


type Props = {
  token?: string,
  data?: any,
  bookmarkResouces?: Resource[],
  bookmark?: string
}


const Home = ({
  token,
  data,
  bookmarkResouces,
  bookmark
}: Props) => {
  const { setIsOpen, setSteps } = useTour()
  const router = useRouter()
  const { session } = useUserData()
  const { allResources } = useAllResources()
  const { selectedTab } = useSelectedTab()
  const {isSearchModalOpen, setIsSearchModalOpen} = useSearchModal()
  const [isLoadingModalOpen, setisLoadingModalOpen] = useState(true)
  const {setAllResourcesServerSide} = useSetAllResourcesServerSide()
  useEffect(() => {
    if (session) {
      setSteps!([
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
      if (!localStorage.getItem('sessiontour') && isDesktop) {
        setIsOpen(true)
      }
    }
  }, [session])

  useEffect(() => {
    //event listner if clrt+space is pressed then open search modal
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.code === 'Space') {
        setIsSearchModalOpen(true)
      }
      if(isSearchModalOpen && e.code === 'Escape'){
        setIsSearchModalOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)

    //token is available in url
    if (token !== '') {
      //add token to localstorage
      localStorage.setItem('token', token as string)
      //remove token from url
      window.history.replaceState({}, document.title, "/");

      window.location.reload()
    }
    setAllResourcesServerSide(data)


    setisLoadingModalOpen(false)
    if (allResources.length > 0) {
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }

  }, [])

  useEffect(() => {
    if(router.query?.bookmark && (!bookmarkResouces?.length || bookmarkResouces?.length === 0)){
      const { query } = router;
      delete query.bookmark;
  
      router.replace({
        pathname: router.pathname,
        query: query,
      }, undefined, { shallow: true });
    }
  }, [router?.query?.bookmark])

  return (
    <>
      <SEO />
      <NavBar />
      <div className={`md:flex hidden`}>
        <div>
          <Category />
          <div className={`flex w-[100vw] `}>
            <Sidebar />
            <Dashboard />
          </div>
        </div>
      </div>
      <SwipeUI />
      <LoadingModal isOpen={isLoadingModalOpen} setIsOpen={setisLoadingModalOpen} />
      <SearchBarModal isOpen={isSearchModalOpen} setIsOpen={setIsSearchModalOpen} />
      <BookmarkModal isOpen={
        bookmarkResouces?.length && bookmarkResouces?.length>0 && router.query?.bookmark ? true : false
      } setIsOpen={() => { }} resources={bookmarkResouces} />
    </>
  )
}

export async function getServerSideProps({ query }: { query: { token: string, bookmark:string } }) {
  const res = await fetch(process.env.NEXT_PUBLIC_LAZYWEB_BACKEND_URL + '/api/websites')
  const data = await res.json()

  let bookmarkResouces = []
  if(query?.bookmark){
    const res = await fetch(process.env.NEXT_PUBLIC_LAZYWEB_BACKEND_URL + `/api/websites/bookmarks/${query?.bookmark}`)
    const bookmarkData =  await res.json()
    bookmarkResouces = bookmarkData?.resources
  }

  return {
    props: {
      token: query?.token || '',
      data,
      bookmarkResouces,
      bookmark: query?.bookmark || ''
    }
  };
}


export default Home