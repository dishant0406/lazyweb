import { FeatureDetails, Features, Footer, Hero, NavBar, SEO, WhyLazyweb } from 'components'
import React, { useEffect } from 'react'
import { ParallaxProvider } from 'react-scroll-parallax'
import AOS from 'aos';
import 'aos/dist/aos.css'; // You can also use <link> for styles
// ..


const Home = () => {
  useEffect(() => {
    AOS.init({
      // duration: 1000,
      once: true,
      easing: 'ease-in-out'
    })
  }, [])

  return (
    <ParallaxProvider>
      <div className='bg-gray'>
        <SEO title="Lazyweb Rocks: The ultimate resource for developers" />
        <NavBar />
        <Hero />
        <Features />
        <WhyLazyweb />
        <FeatureDetails />
        <Footer />
      </div>
    </ParallaxProvider>
  )
}

export default Home