import { PlaygroundComponent } from '@/components'
import PlaygroundMobile from '@/components/mobile/PlaygroundMobile'
import Head from 'next/head'
import React from 'react'
import { isDesktop } from 'react-device-detect'

type Props = {}

const Playground = (props: Props) => {
  return (
    <>
      <Head>
        <title>LazyWeb: JS Playground</title>
        <meta name="description" content="LazyWeb Javascript Playground" />
      </Head>
      <div className='h-[100vh] w-[100vw] md:block hidden'>
        <PlaygroundComponent />
      </div>
      <div className='h-[100vh] w-[100vw] md:hidden block'>
      <PlaygroundMobile/>
      </div>
    </>
  )
}

export default Playground