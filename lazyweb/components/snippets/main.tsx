import React, { Suspense } from 'react'
import NavBar from '../shared/NavBar/NavBar'
import Container from './micro/Container'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'

const Code = dynamic(() => import('./micro/Code'), { ssr: false })

type Props = {}

const SnippetsContainer = (props: Props) => {
  const router = useRouter()

  return (
    <div className='w-full md:block hidden'>
      <NavBar />
      <div className='min-h-[100vh] relative flex px-[10vw] py-[calc(10vh+80px)] items-center flex-col justify-center w-full bg-[#202123]'>
        <Container>
          <Suspense fallback={<div>Loading Editor...</div>}>
            <div className='relative'>

              <Code />

              {router?.query?.style === 'stack' && <div className='w-full h-full absolute top-[10px] left-[10px] z-[0]'>
                <Code noHeading />
              </div>}

            </div>
          </Suspense>
        </Container>
      </div>
    </div>
  )
}

export default SnippetsContainer