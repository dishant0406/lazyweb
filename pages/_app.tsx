import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { NavBar } from '../components'
import Head from 'next/head'
import Favicon from '../components/utility/Favicon/Favicon'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>LazyWeb: Resources that you need</title>
        <Favicon/>
      </Head>
      <NavBar/>
      <Component {...pageProps} />
    </>
  )
}
