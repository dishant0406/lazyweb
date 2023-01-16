type Props = {}

const Hero = (props: Props) => {
  return (
    <div>
      <div className="w-[100vw] flex justify-center">
        <img src='assets/Logo.png' className="mt-[3rem] h-[20vw] md:h-[6vw]" alt="LazyWeb Logo"/>
      </div>
        <div className="w-[100vw] flex justify-center">
          <div className="w-[70vw] md:w-[40vw]">
            <h2 className="text-center font-[600] md:mt-[2rem] mt-[1rem] md:leading-[3.5vw] leading-[6vw] text-[5vw] md:text-[2.5vw]">Effortlessly find developer resources at Lazyweb</h2>
          </div>
        </div>
        <div className="w-[100vw] flex justify-center md:mt-[3rem] mt-[1rem]">
          <img src="assets/lazyweb-ss-2.png" className="md:w-[80vw] w-[90vw]" alt="Lazyweb Website ScreenShot" />
        </div>
    </div>
  )
}

export default Hero