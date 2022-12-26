import { Category, Sidebar, Dashboard, Favicon,CommingSoon } from 'components'


type Props = {}

const Home = (props: Props) => {

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