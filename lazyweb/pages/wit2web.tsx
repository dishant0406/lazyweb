import Head from 'next/head'
import Image from 'next/image'
import React from 'react'
import {BsStars} from 'react-icons/bs'

type Props = {}

const Wit2Web = (props: Props) => {
  return (
    <>
    <Head>
        <meta charSet="UTF-8" />
        <title>Wit2Web: Lazy Dev Tool</title>
        <meta name="description" content={
          'Why write code when you can describe? Generate HTML with Tailwind CSS classes from text. Lazy coding has never looked so good!'
        } />
        <meta name="keywords" content="Text-to-HTML, Lazy Developer, Tailwind CSS, HTML Generator, UI Design, Web Development, Code Generator, Effortless Coding, Rapid Prototyping, Text-to-Code, Lazyweb, Wit2Web, Automated UI, HTML Templates, Text-based Design" />
        <meta name="author" content="Dishant Sharma" />

        <meta property="og:title" content="Wit2Web: Lazy Dev Tool" />
        <meta property="og:description" content={
          'Why write code when you can describe? Generate HTML with Tailwind CSS classes from text. Lazy coding has never looked so good!'
        } />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://app.lazyweb.rocks/wit2web" />
        <meta property="og:image" content="https://cdn.jsdelivr.net/gh/dishant0406/images-repo@master/wit2web.png" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Wit2Web: Lazy Dev Tool" />
        <meta name="twitter:description" content={
          'Why write code when you can describe? Generate HTML with Tailwind CSS classes from text. Lazy coding has never looked so good!'
        } />
        <meta name="twitter:image" content="https://cdn.jsdelivr.net/gh/dishant0406/images-repo@master/wit2web.png" />
        <meta name="twitter:site" content="@dishant0406" />
        <meta name="twitter:creator" content="@dishant0406" />

        <link rel="icon" href="/assets/webfavicon.ico" type="image/x-icon" />
      </Head>

    <div className='w-[100vw] font-sans min-h-[100vh] bg-gray overflow-y-auto relative overflow-x-hidden'>
      <div className=' py-[1rem] sticky top-0 bg-gray w-full px-[1rem] flex justify-between items-center'>
        <Image src='/assets/wit2web.jpeg' width={45} height={45} alt='Wit2Web Logo' />
        <button className='bg-altGray text-white px-[1.2rem] py-[0.8rem] rounded-md text-md shadow-md hover:shadow-lg transition-all duration-200'>
          <BsStars className='inline mr-[0.5rem] text-white'/>
          Generate UI
        </button>
      </div>
    </div>
    </>
  )
}

export default Wit2Web