import { useEffect, useState } from 'react'
import { Category } from '../components'
import {supabaseClient} from '../lib/supabaseClient'

type Props = {}

const Home = (props: Props) => {



  return (
    <div>
      <Category/>
    </div>
  )
}

export default Home