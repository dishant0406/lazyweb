import { FeatureDetails, Features, Footer, Hero, NavBar, SEO, WhyLazyweb } from 'components'
import React from 'react'

const Home = () => {
  return (
    <div>
      <SEO title="Lazyweb Rocks: The ultimate resource for developers"/>
      <NavBar/>
      <Hero/>
      <Features/>
      <WhyLazyweb/>
      <FeatureDetails/>
      <Footer/>
    </div>
  )
}

export default Home