import { useEffect, useState } from 'react'
import { Category, Sidebar } from '../components'
import {supabaseClient} from '../lib/supabaseClient'

type Props = {}

const Home = (props: Props) => {



  return (
    <div>
      <Category/>
      <Sidebar/>
    </div>
  )
}

export default Home