import 'styles/globals.css'
import 'react-spring-bottom-sheet/dist/style.css'
import type { AppProps } from 'next/app'
import { NavBar } from 'components'
import Head from 'next/head'
import Favicon from 'components/utility/Favicon/Favicon'
import { TourProvider, useTour } from '@reactour/tour'
import { useUserData } from '@/hooks';

export default function App({ Component, pageProps }: AppProps) {
  const {session} = useUserData()

  return (
    <>
      <Head>
        <title>LazyWeb: Resources that you need</title>
      </Head>
      <TourProvider
      afterOpen={
        () => {
          if(session){
            localStorage.setItem('sessiontour', 'true')
          }else{
            localStorage.setItem('nosessiontour', 'true')
          }
        }
      }
      styles={{
        popover: (base) => ({
          ...base,
          '--reactour-accent': '#5e5f60',
          borderRadius: 20,
          padding: 20,
          backgroundColor:'#202124',
          color:'#fff',
        }),
        maskArea: (base) => ({ ...base }),
        maskWrapper: (base) => ({ ...base }),
        badge: (base) => ({ ...base, left: 'auto', right: '-0.8125em' }),
        controls: (base) => ({ ...base }),
        close: (base) => ({ ...base, right: 'auto', visibility:'hidden' }),
      }}
      steps={ [
          {
            selector: '.lazyweb-logo',
            content: 'Welcome to Lazyweb',
          },
          {
            selector: '.lazyweb-login',
            content: 'Click here to open the login modal and login',
          },
          {
            selector: '.lazyweb-tags',
            content: 'Click on any of the tags to see the resources related to that tag ( Scroll using Shift + scroll )',
          },
          {
            selector: '.lazyweb-category',
            content: 'Filter resources according to the categories',
          },
          {
            selector: '.lazyweb-top-product',
            content: 'Daily new resource for exposure to different amazing resources available',
          },
          {
            selector: '.lazyweb-resource-list',
            content: 'Access Saved resources and resources that you add after siging in',
          }
        ]
      }>
      <NavBar/>
      <Component {...pageProps} />
      </TourProvider>
    </>
  )
}
