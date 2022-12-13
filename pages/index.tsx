import { Category, Sidebar, Dashboard, Favicon } from 'components'
import {supabaseClient} from 'lib/supabaseClient'


type Props = {}

const Home = (props: Props) => {

  return (
    <>
    <Favicon/>
      <div>
        <Category/>
        <div className='flex w-[100vw]'>
          <Sidebar/>
          <Dashboard/>
        </div>
      </div>
    </>
  )
}

export default Home