import Link from "next/link"
import { AiFillGithub } from "react-icons/ai"
import { FaSitemap } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";

type Props = {}

const Footer = (props: Props) => {
  return (
    <div className="py-3  md:pb-2 flex items-center justify-center w-[100vw] bg-black">
      <div className="h-full flex-col md:flex-row md:justify-between justify-center flex items-center md:my-[1rem] w-[90vw] bg-black">
        <div className="flex flex-col md:flex-row gap-1 md:mb-0 mb-3 md:gap-[1rem] items-center">
          <div className="bg-white md:mt-0 mt-[1rem] md:bg-white">
            <img src="assets/LogoMain.webp" className="h-10 md:h-10" alt="Lazyweb Main Logo" />
          </div>
          <p className="text-white md:text-[16px] md:mt-0 mt-[1rem] text-[14px]">Copyright by {new Date().getFullYear()} Lazyweb.rocks</p>
        </div>
        <div className="flex gap-[1rem] items-center">
          <Link href="/sitemap.xml">
            <FaSitemap className="w-5 h-5 text-white transition-all duration-300 md:w-7 md:h-7 hover:text-trueGray-400" />
          </Link>
          <Link href="https://twitter.com/dishant0406">
            <FaTwitter className="w-5 h-5 text-white transition-all duration-300 md:w-7 md:h-7 hover:text-trueGray-400" />
          </Link>
          <Link href="https://www.linkedin.com/in/dishant0406/">
            <FaLinkedin className="w-5 h-5 text-white transition-all duration-300 md:w-7 md:h-7 hover:text-trueGray-400" />
          </Link>
          <Link href="https://github.com/dishant0406/lazyweb">
            <AiFillGithub className="w-5 h-5 text-white transition-all duration-300 md:w-7 md:h-7 hover:text-trueGray-400" />
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Footer