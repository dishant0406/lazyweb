import React from 'react'
import NavBar from '../shared/NavBar/NavBar'
import Container from './micro/Container'
import Code from './micro/Code'

type Props = {}

const SnippetsContainer = (props: Props) => {
  return (
    <div className='w-full'>
      <NavBar />
      <div className='min-h-[100vh] relative flex px-[10vw] py-[calc(10vh+80px)] items-center flex-col justify-center w-full bg-[#202123]'>
        <Container>
          <Code />
        </Container>
      </div>
    </div>
  )
}

export default SnippetsContainer