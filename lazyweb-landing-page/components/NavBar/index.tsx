type Props = {}

const NavBar = (props: Props) => {

  const handleGoto = () => {
    //href to a url using button
    window.location.href = "https://app.lazyweb.rocks"
  }

  const handleClick = (goto:string) => {
    //href to a classname
    const element = document.getElementById(goto)
    element?.scrollIntoView({behavior: "smooth"})
  }


  return (
   <div className="w-[100vw] flex justify-center">
     <div className="h-[64px] w-[90vw] flex items-center justify-between">
      <img src="assets/LogoMain.png" className="h-[45px]" alt="Lazyweb Main Logo"/>
      <div className="md:flex hidden gap-[2rem]">
      <p onClick={()=>handleClick('feature')} className="cursor-pointer text-gray">Features</p>
      <p onClick={()=>handleClick('services')} className="cursor-pointer text-gray">Services</p>
      </div>
      <button onClick={handleGoto} className="bg-gray text-white rounded-[5px] px-[25px] h-[45px] whitespace-nowrap">Start Using</button>
    </div>
   </div>
  )
}

export default NavBar