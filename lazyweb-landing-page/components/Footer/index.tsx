import Link from "next/link"
import {AiFillGithub} from "react-icons/ai"

type Props = {}

const Footer = (props: Props) => {
  return (
    <div className="py-3 flex items-center justify-center w-[100vw] bg-gray">
      <div className="h-full flex-col md:flex-row md:justify-between justify-center flex items-center w-[90vw] bg-gray">
        <div className="flex flex-col md:flex-row gap-1 md:mb-0 mb-3 md:gap-[1rem] items-center">
          <div className="md:bg-white bg-white">
            <img src="assets/LogoMain.png" className="md:h-16 h-10" alt="Lazyweb Main Logo"/>
          </div>
            <p className="text-white md:text-[16px] text-[10px]">Copyright by {new Date().getFullYear()} Lazyweb.rocks</p>
        </div>
        <Link href="https://github.com/dishant0406/lazyweb">
          <AiFillGithub className="text-white md:w-7 md:h-7 w-5 h-5 duration-300 transition-all hover:text-trueGray-400"/>
        </Link>
      </div>
    </div>
  )
}

export default Footer