import { PlaygroundComponent } from '@/components'
import Head from 'next/head'
import React from 'react'

type Props = {}

const Playground = (props: Props) => {
  return (
    <>
      <Head>
        <title>LazyWeb: JS Playground</title>
        <meta name="description" content="LazyWeb Javascript Playground" />
      </Head>
      <PlaygroundComponent />
    </>
  )
}

export default Playground