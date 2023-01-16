type Props = {}

const Footer = (props: Props) => {
  return (
    <div className="h-[80px] flex items-center justify-center w-[100vw] bg-gray">
      <div className="h-[80px] gap-[1rem] md:justify-start justify-center flex items-center w-[90vw] bg-gray">
        <div className="bg-white h-[45px] w-[140px]">
          <img src="assets/LogoMain.png" className="h-[45px]" alt="Lazyweb Main Logo"/>
        </div>
          <p className="text-white md:text-[16px] text-[10px]">Copyright by {new Date().getFullYear()} Lazyweb.rocks</p>
      </div>
    </div>
  )
}

export default Footer