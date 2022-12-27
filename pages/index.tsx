import { Category, Sidebar, Dashboard, Favicon,CommingSoon } from 'components'
import { useEffect } from 'react'
import { useStoreVisitersInfoIfDoesNotExist } from '@/hooks/Zustand';


type Props = {}

const Home = (props: Props) => {
  const {setVisitersInfo} = useStoreVisitersInfoIfDoesNotExist()

  useEffect(()=>{
    setVisitersInfo()

  },[])

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