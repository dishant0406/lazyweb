import Image from "next/image"

type Props = {}

const Features = (props: Props) => {
  return (
    <div id='feature' className="bg-black gap-[2rem] flex flex-col md:flex-row  md:justify-center p-[2rem] md:p-[4rem] mt-[5rem]">
      <div className="md:w-[40vw] w-full h-[60vh] md:h-[90vh] relative overflow-hidden p-[2rem] md:p-[3rem] bg-gray rounded-3xl">
        <p data-aos="fade-right" className="md:text-[3vw] text-[5.5vw] leading-[1.2] font-medium text-white">
          Add your own resources.
        </p>
        <p data-aos="fade-right" className="md:text-[1vw] text-[3vw] leading-[1.5] mt-[0.7rem] opacity-50 text-white">
          You can add your own resources to the site, so that others can benefit from your knowledge and experience.
        </p>
        <Image data-aos="fade-left" src='/assets/add-res.png' width={700} height={700} className="absolute md:h-[90%] w-auto bottom-[-25%] shadow-[rgba(0,_0,_0,_0.4)_0px_30px_90px] rounded-2xl right-[-10%] md:right-[0%]" alt="LazyWeb Logo" />
      </div>
      <Image data-aos="zoom-out" src="/assets/mobile-ss.png" width={500} height={500} className="md:h-[90vh] rounded-3xl md:w-[30vw]" alt="LazyWeb Logo" />
      <div className="md:w-[25vw] w-full md:h-[90vh] h-[55vh] relative overflow-hidden md:p-[3rem] p-[2rem] bg-gray rounded-3xl">
        <p data-aos="fade-left" className="md:text-[3vw] text-[5.5vw] leading-[1.2] font-medium text-white">
          Share Resources.
        </p>
        <p data-aos="fade-left" className="md:text-[1vw] text-[3vw] leading-[1.5] mt-[0.7rem] opacity-50 text-white">
          Share your resources with your friends and colleagues with just a click of a button.
        </p>
        <Image data-aos="fade-right" src='/assets/qr.png' width={700} height={700} className="absolute md:h-[60%] h-[70%] w-auto bottom-[5%]  md:bottom-[2%] shadow-[rgba(0,_0,_0,_0.4)_0px_30px_90px] rounded-2xl right-[30%]  md:right-[20%]" alt="LazyWeb Logo" />
      </div>
    </div>
  )
}

export default Features

/*
   <div id="feature" className="w-[100vw] flex-col flex items-center">
        <div className="w-[90vw] flex flex-col items-center">
          <h2 className="text-center font-[600] md:mt-[4rem] mt-[1rem] text-[4vw] md:text-[2vw]">What are the features of Lazyweb</h2>
          <h2 className="text-center font-[600] text-lightGray opacity-70 mt-[0.5rem] text-[3vw] md:text-[1vw]">Features are highlighted here</h2>
        </div>
        <div className="flex w-[90vw] md:justify-between justify-center flex-wrap mt-[2rem]">
          <div className="flex md:w-[25vw] w-[50vw] md:gap-[2rem] items-center md:flex-row flex-col">
            <img src="assets/resources.webp" className="h-[6rem]" alt="Feature 1" />
            <div className="flex flex-col items-center md:items-start">
              <h2 className=" font-[600] text-[2.5vw] md:text-[1.2vw] mt-[1rem]">90+ available resources</h2>
              <p className=" text-lightGray md:text-start text-center  opacity-70 text-[1.5vw] md:text-[1vw] mt-[0.5rem]">We have a vast collection of over 90 resources for developers, ranging from useful tools and libraries to educational articles and tutorials.</p>
            </div>
          </div>
          <div className="flex md:w-[25vw] w-[50vw] md:gap-[2rem] items-center md:flex-row flex-col">
            <img src="assets/bookmark.webp" className="h-[6rem]" alt="Feature 1" />
            <div className="flex flex-col items-center md:items-start">
              <h2 className="font-[600] text-[2.5vw] md:text-[1.2vw] mt-[1rem]">Bookmark your favourite resources</h2>
              <p className=" text-lightGray md:text-start text-center  opacity-70 text-[1.5vw] md:text-[1vw] mt-[0.5rem]">You have the option to bookmark your favourite resources for easy access later on.</p>
            </div>
          </div>
          <div className="flex md:w-[25vw] w-[50vw] md:gap-[2rem] items-center md:flex-row flex-col">
            <img src="assets/upload.webp" className="h-[6rem]" alt="Feature 1" />
            <div className="flex flex-col items-center md:items-start">
              <h2 className=" font-[600] text-[2.5vw] md:text-[1.2vw] mt-[1rem]">Upload new resources</h2>
              <p className=" text-lightGray md:text-start text-center  opacity-70 text-[1.5vw] md:text-[1vw] mt-[0.5rem]">We allow you to upload your own resources to the site, so that others can benefit from your knowledge and experience.</p>
            </div>
          </div>
        </div>
      </div>
*/