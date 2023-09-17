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
        <meta charSet="UTF-8" />
        <title>LazyWeb: JS Playground</title>
        <meta name="description" content="LazyWeb Javascript Playground" />
        <meta name="keywords" content="JavaScript, Playground, LazyWeb" />
        <meta name="author" content="Dishant Sharma" />

        <meta property="og:title" content="LazyWeb: JS Playground" />
        <meta property="og:description" content="LazyWeb Javascript Playground" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://app.lazyweb.rocks/playground" />
        <meta property="og:image" content="https://cdn.jsdelivr.net/gh/dishant0406/images-repo@master/LazywebPlayground.png" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="LazyWeb: JS Playground" />
        <meta name="twitter:description" content="LazyWeb Javascript Playground" />
        <meta name="twitter:image" content="https://cdn.jsdelivr.net/gh/dishant0406/images-repo@master/LazywebPlayground.png" />
        <meta name="twitter:site" content="@dishant0406" />
        <meta name="twitter:creator" content="@dishant0406" />

        <link rel="icon" href="/assets/playfavicon.ico" type="image/x-icon" />
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