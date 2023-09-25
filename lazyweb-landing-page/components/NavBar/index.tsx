type Props = {}

const NavBar = (props: Props) => {

  const handleGoto = () => {
    //href to a url using button
    window.location.href = "https://app.lazyweb.rocks"
  }

  const handleClick = (goto: string) => {
    //href to a classname
    const element = document.getElementById(goto)
    element?.scrollIntoView({ behavior: "smooth" })
  }


  return (
    <div className="w-[100vw] z-[10] sticky top-0 flex justify-center">
      <div className="h-[64px] nav-back w-full px-[4rem] flex items-center justify-center md:justify-between">
        <div className="bg-white">
          <img src="assets/LogoMain.webp" className="h-[40px]" alt="Lazyweb Main Logo" />
        </div>
        <div className="md:flex hidden gap-[2rem]">
          <p onClick={() => handleClick('feature')} className="text-white cursor-pointer">Features</p>
          <p onClick={() => handleClick('services')} className="text-white cursor-pointer">Services</p>
        </div>
        <button onClick={handleGoto} className="bg-white md:flex items-center justify-center hidden font-medium text-gray rounded-lg px-[20px] h-[40px] whitespace-nowrap">Launch App</button>
      </div>
    </div>
  )
}

export default NavBar