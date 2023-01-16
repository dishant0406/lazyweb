import { useState } from 'react'
import {FcAddImage, FcApproval, FcBookmark, FcIdea} from 'react-icons/fc'
type Props = {}

const FeatureDetails = (props: Props) => {
  const [selectedImage, setSelectedImage] = useState('assets/feat-1.png')
  const [Tabs, setTabs] = useState([
    {
      id: 1,
      title: '90+ Resources',
      icon:<FcApproval className="md:text-[1.8rem] text-[1.4rem]"/>,
      selected:true ,
      image:'assets/feat-1.png'
    },
    {
      id: 2,
      title: 'Add your resource',
      icon:<FcAddImage className="md:text-[1.8rem] text-[1.4rem]"/>,
      selected:false,
      image:'assets/feat-2.png'
    },
    {
      id: 3,
      title: 'Bookmark favourite resources',
      icon:<FcBookmark className="md:text-[1.8rem] text-[1.4rem]"/>,
      selected:false,
      image:'assets/feat-3.png'
    },
    {
      id: 4,
      title: 'Top Product every day',
      icon:<FcIdea className="md:text-[1.8rem] text-[1.4rem]"/>,
      selected:false,
      image:'assets/lazyweb-ss-2.png'
    },
    
  ])

  const handleSelect = (id:number, image:string)=>{
    setTabs(Tabs.map((tab)=>{
      if(tab.id===id){
        tab.selected=true
      }else{
        tab.selected=false
      }
      return tab
    }
    ))
    setSelectedImage(image)
  }
  return (
    <div>
      <div id='services' className="w-[100vw] mb-[2rem] flex-col flex items-center">
        <div className="w-[90vw] flex flex-col items-center">
          <h2 className="text-center font-[600] md:mt-[4rem] mt-[1rem] text-[4vw] md:text-[2vw]">What are the features of Lazyweb</h2>
          <h2 className="text-center font-[600] text-lightGray opacity-70 mt-[0.5rem] text-[3vw] md:text-[1vw]">Introducing all screen details</h2>
        </div>
        <div className="md:w-[90vw] w-[100vw] md:overflow-hidden overflow-y-scroll mt-[2rem] md:mt-[3rem] flex justify-center">
         
         {
            Tabs.map((tab)=>{
              return(
                <div key={tab.id} onClick={()=>handleSelect(tab.id, tab.image)} className={`flex gap-[10px] cursor-pointer w-fit pb-[1rem] px-[1rem] ${tab.selected?'border-b-[3px]':'border-b'} border-gray ${tab.selected===false && 'border-opacity-20'} items-center`}>
                  {tab.icon}
                  <p className='md:text-[18px] text-[10px] whitespace-nowrap'>{tab.title}</p>
                </div>
              )
            })
         }
        </div>
        <img className='md:w-[90vw]' src={selectedImage}/>
      </div>
    </div>
  )
}

export default FeatureDetails