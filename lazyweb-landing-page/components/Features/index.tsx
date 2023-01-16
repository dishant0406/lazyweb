type Props = {}

const Features = (props: Props) => {
  return (
    <div>
      <div id="feature" className="w-[100vw] flex-col flex items-center">
        <div className="w-[90vw] flex flex-col items-center">
          <h2 className="text-center font-[600] md:mt-[4rem] mt-[1rem] text-[4vw] md:text-[2vw]">What are the features of Lazyweb</h2>
          <h2 className="text-center font-[600] text-lightGray opacity-70 mt-[0.5rem] text-[3vw] md:text-[1vw]">Features are highlighted here</h2>
        </div>
        <div className="flex w-[90vw] md:justify-between justify-center flex-wrap mt-[2rem]">
          <div className="flex md:w-[25vw] w-[50vw] md:gap-[2rem] items-center md:flex-row flex-col">
            <img src="assets/resources.png" className="h-[6rem]" alt="Feature 1" />
            <div className="flex flex-col md:items-start items-center">
              <h2 className=" font-[600] text-[2.5vw] md:text-[1.2vw] mt-[1rem]">90+ available resources</h2>
              <p className=" text-lightGray md:text-start text-center  opacity-70 text-[1.5vw] md:text-[1vw] mt-[0.5rem]">We have a vast collection of over 90 resources for developers, ranging from useful tools and libraries to educational articles and tutorials.</p>
            </div>
          </div>
          <div className="flex md:w-[25vw] w-[50vw] md:gap-[2rem] items-center md:flex-row flex-col">
            <img src="assets/bookmark.png" className="h-[6rem]" alt="Feature 1" />
            <div className="flex flex-col md:items-start items-center">
              <h2 className="font-[600] text-[2.5vw] md:text-[1.2vw] mt-[1rem]">Bookmark your favourite resources</h2>
              <p className=" text-lightGray md:text-start text-center  opacity-70 text-[1.5vw] md:text-[1vw] mt-[0.5rem]">You have the option to bookmark your favourite resources for easy access later on.</p>
            </div>
          </div>
          <div className="flex md:w-[25vw] w-[50vw] md:gap-[2rem] items-center md:flex-row flex-col">
            <img src="assets/upload.png" className="h-[6rem]" alt="Feature 1" />
            <div className="flex flex-col md:items-start items-center">
              <h2 className=" font-[600] text-[2.5vw] md:text-[1.2vw] mt-[1rem]">Upload new resources</h2>
              <p className=" text-lightGray md:text-start text-center  opacity-70 text-[1.5vw] md:text-[1vw] mt-[0.5rem]">We allow you to upload your own resources to the site, so that others can benefit from your knowledge and experience.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Features